import './styles/AdminUser.css'
import './styles/Table.css'
import 'react-datepicker/dist/react-datepicker.css';

import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import DatePicker from 'react-datepicker';

import { default as Select } from "react-select";

import { evaluationTypes, evaluationMoments, elements } from './Data.tsx'

import FetchSubjects from './Fetch/FetchSubjects.tsx';

function User() {

    const [user, setUser] = useState<any>(null);
    const [userCourse, setUserCourse] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();

    // Função para obter os dados do utilizador e o curso correspondente
    const fetchUserData = async (userId: string) => {
        try {
            const response = await fetch('http://localhost:8080/app/users/' + userId);
            
            if (!response.ok) {
            throw new Error('Erro ao obter os dados do utilizador ' + userId + '.');
            }

            const userData = await response.json();
            setUser(userData);

            if (userData.courseAtt) {
            setUserCourse(userData.courseAtt);
            }

        } catch (error) {
            alert('Erro na comunicação com o servidor: ' + error);
        }
    };

    useEffect(() => {
    if (id) {
        fetchUserData(id);
    }
    }, [id]);

    // Fetch dos subjects do curso
    const [subjects, setSubjects] = useState<{ value: number; course: number; year: number; semester: number; label: string }[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
            const response = await fetch("http://localhost:8080/app/courses");
            if (response.ok) {
                const data = await response.json();

                const course = data.find((course: { courseName: string }) => course.courseName === userCourse);
                if (course) {
                setSelectedCourse(course.courseId);
                }
            } else {
                alert('Erro ao obter cursos');
            }
            } catch (error) {
            alert('Erro na comunicação com o servidor ao obter cursos.');
            }
        };

        if (userCourse) {
            fetchCourses();
        }
    }, [userCourse]);
    
    // Obter disciplinas do curso com base no selectedCourse (courseId)
    const subjectsByCourse = subjects.filter((subject) => subject.course === selectedCourse);

    const [selectedSubjects, setSelectedSubjects] = useState<{ value: number; label: string }[]>([]);
    const handleSubjectSelect = (selectedOptions: any) => {
        setSelectedSubjects(selectedOptions || []);
    };

    // Toggle button para selecionar o semestre a que o mapa vai corresponder
    const [selectedSemester, setSelectedSemester] = useState<'1º Semestre' | '2º Semestre'>('1º Semestre');
    const [numericSemester, setNumericSemester] = useState<number>(1);
    
    const toggleSemester = (semester: '1º Semestre' | '2º Semestre') => {
        setSelectedSemester(semester);

        const numericValue = semester === '1º Semestre' ? 1 : 2;
        setNumericSemester(numericValue);
    }

    // Obter cadeiras por curso e semestre
    const subjectsByCourseSemester = selectedCourse ? subjectsByCourse.filter(
        (subject) => subject.semester === numericSemester
    ) : [];

    // Campos e submits

    // Remover subject
    async function handleRemoveSubject(subjectToRemove: {value: number, label: string}) {
        const confirmDelete = window.confirm('Tem a certeza que deseja remover a disciplina:' + subjectToRemove.label + '?');
    
        if (!confirmDelete) return;
    
        try {
        const response = await fetch('http://localhost:8080/app/subjects/' + subjectToRemove.value, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            setSelectedSubjects((prev) =>
            prev.filter((subject) => subject.value !== subjectToRemove.value)
            );
    
            setSubjects((prevSubjects) =>
            prevSubjects.filter((subject) => subject.value !== subjectToRemove.value)
            );
    
            alert('Unidade Curricular removida com sucesso!');
        } else {
            alert('Erro ao remover unidade curricular: ' + subjectToRemove.label + '.');
        }
        } catch (error) {
        alert('Erro na comunicação com o servidor.' + error);
        }
    }

    // Remover vários subjects
    const handleRemoveAllSubjects = async () => {
        const confirmDelete = window.confirm(
        'Tem a certeza que deseja remover todas as disciplinas selecionadas?'
        );
  
        if (!confirmDelete) return;

        for (const subject of selectedSubjects) {
        try {
            const response = await fetch(
            'http://localhost:8080/app/subjects/' + subject.value,
            {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            }
            );
    
            if (response.ok) {
            setSelectedSubjects((prev) =>
                prev.filter((s) => s.value !== subject.value)
            );
            setSubjects((prevSubjects) =>
                prevSubjects.filter((s) => s.value !== subject.value)
            );
            alert('Unidades curriculares removidas com sucesso.')
            } else {
            alert('Erro ao remover unidade curricular: ' + subject.label + '.');
            }
        } catch (error) {
            alert('Erro na comunicação com o servidor.');
        }
        }
    }

    const [subjectName, setSubjectName] = useState("");
    const [subjectSemester, setSubjectSemester] = useState("");
    const [subjectYear, setSubjectYear] = useState("");
    const [subjectStudentsEnrolled, setSubjectStudentsEnrolled] = useState("");

    function validateSubject() {
        return subjectName.length > 0 && subjectSemester.length > 0 && subjectYear.length > 0 && subjectStudentsEnrolled.length > 0;
    }

    // Adicionar subject
    async function handleAddSubjectSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        const newSubject = {
        "subjectName": subjectName,
        "courseId": selectedCourse,
        "studentsEnrolled": subjectStudentsEnrolled,
        "subjectYear": subjectYear,
        "subjectEvaluationType": "Mista",
        "subjectSemester": subjectSemester
        }

        try {
        const response = await fetch('http://localhost:8080/app/subjects', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(newSubject),
        });


        if (response.ok) {
            const addedSubject = await response.json();

            setSubjects((prevSubjects) => [...prevSubjects, addedSubject]); 

            setSubjectName('');
            setSubjectSemester('');
            setSubjectYear('');
            setSubjectStudentsEnrolled('');

            alert('Curso editado com sucesso!');
        } else {
            alert('Erro ao editar o curso.');
        }
        } catch (error) {
        alert(error);
        }
    }

    // Aparecer e desaparecer on button click
        // Editar curso
    const [isEditCShown, setIsEditCShown] = useState(false);
    const showEditCourse = () => {
        setIsEditCShown(current => !current);
    }

        // Adicionar uc
        const [isAddSubjectShown, setIsSubjectShown] = useState(false);
        const showAddSubject = () => {
            setIsSubjectShown(current => !current);
        }
        
        // Mapa de avaliações
    const [isEvalMapShown, setIsEvalMapShown] = useState(false);
    const showEvaluationMap = () => {
        setIsEvalMapShown(current => !current);
    }

    const [subjectAttendance, setSubjectAttendance] = useState<{ [key: number]: string }>({});
    const [subjectEvaluationType, setSubjectEvaluationType] = useState<{ [key: number]: string }>({}); 

    // Update attendance e evaluation type de subjects
    async function handleUpdateAllSubjects(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
    
        const subjectsToUpdate = subjectsByCourseSemester;
    
        try {
        for (const subject of subjectsToUpdate) {
            const updatedSubject = {
            "subjectAttendance": subjectAttendance[subject.value],
            "subjectEvaluationType": subjectEvaluationType[subject.value],
            }
    
            const response = await fetch('http://localhost:8080/app/subjects/' + subject.value, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedSubject),
            });
            if (!response.ok) {
            alert('Erro ao atualizar a disciplina ' + subject.label);
            }
        }  
        } catch (error) {
        alert('Erro na comunicação com o servidor.');
        }
    }

    const [localDate, setLocalDate] = useState<{ [key: string]: Date | null }>({});
    const [localTime, setLocalTime] = useState<{ [key: string]: Date | null }>({});
    const [localDateTime, setLocalDateTime] = useState<{ [key: string]: Date | null }>({});

    // Função para atualizar data e hora separadamente
    const updateLocalData = (subjectId: number, momentIndex: number, newValue: Date | null) => {
        const key = `${subjectId}-${momentIndex}`;

        if (newValue) {
        setLocalDateTime(prevDates => ({
            ...prevDates,
            [key]: newValue,
        }));

        const dateOnly = new Date(newValue);
        dateOnly.setHours(0, 0, 0, 0);
        setLocalDate(prevDates => ({
            ...prevDates,
            [key]: dateOnly,
        }));

        const timeOnly = new Date(newValue);
        timeOnly.setFullYear(1970, 0, 1);
        setLocalTime(prevTimes => ({
            ...prevTimes,
            [key]: timeOnly,
        }));
        }
    };

    const handleDateChange = (subjectId: number, momentIndex: number) => (newValue: Date | null) => {
        if (newValue) {
        updateLocalData(subjectId, momentIndex, newValue);
    
        setEvaluationDate(formatDate(newValue)); // YYYY-MM-DD
        setEvaluationTime(formatTime(newValue)); // HH:mm:ss
        }
    };

    const formatDate = (date: Date | null): string => {
        if (!date) return '';
        return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    };
    
    const formatTime = (date: Date | null): string => {
        if (!date) return '';
        return date.toISOString().split('T')[1].split('.')[0]; // Formato HH:mm:ss
    };

    const [evaluationElement, setEvaluationElement] = useState("");
    const [evaluationDate, setEvaluationDate] = useState("")
    const [evaluationTime, setEvaluationTime] = useState("");
    const [evaluationWeight, setEvaluationWeight] = useState<{ [key: string]: number | null }>({});
    const [evaluationClassrooms, setEvaluationClassrooms] = useState<Record<string, string>>({});

    // Adicionar evaluations
    async function handleAddEvaluationSubmit(subject: { value: number; course: number }, momentIndex: number) {
        const newEvaluation = {
        "evaluationType": evaluationElement,
        "courseId": subject.course,
        "evaluationWeight": evaluationWeight[`${subject.value}-${momentIndex}`] || 0,
        "evaluationDate": evaluationDate,
        "evaluationHour": evaluationTime,
        "evaluationPosition": momentIndex,
        "subjectId": subject.value,
        };
    
        try {
        const response = await fetch('http://localhost:8080/app/evaluations', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEvaluation),
        });
    
        
        if (response.ok) {
            alert('Avaliação adicionada com sucesso!');
        } else {
            alert('Erro ao adicionar avaliação. Verifique as datas e as ponderações.');
        }
        } catch (error) {
        alert('Erro na comunicação com o servidor: ' + error);
        }
    }
  
    // Load sala da evaluation
    const handleLoadClassroomClick = async (subjectId: number, momentIndex: number) => {
        try {
          const response = await fetch('http://localhost:8080/app/evaluations?subjectId=' + subjectId);
          
          if (!response.ok) {
            throw new Error('Erro na pesquisa das avaliações da unidade curricular.');
          }
      
          const evaluations = await response.json();
          
          const evaluation = evaluations.find((evaluation: any) => evaluation.evaluationPosition === momentIndex);
          
          if (!evaluation) {
            alert('Avaliação não encontrada para o momento especificado.');
            return;
          }
      
          const classroomId = evaluation.classroomId;
          
          if (!classroomId) {
            alert('Sala não encontrada para esta avaliação.');
            return;
          }
      
          const classroomsResponse = await fetch('http://localhost:8080/app/classrooms');
          if (!classroomsResponse.ok) {
            throw new Error('Erro ao pesquisar salas.');
          }
      
          const classrooms = await classroomsResponse.json();
      
          const classroom = classrooms.find((classroom: any) => classroom.classroomId === classroomId);
          
          if (classroom) {
            const classroomTag = classroom.tag;
      
            setEvaluationClassrooms((prev) => ({
              ...prev,
              [`${subjectId}-${momentIndex}`]: classroomTag,
            }));
          } else {
            alert('Sala não encontrada.');
          }
      
        } catch (error) {
          alert('Erro: ' + error);
        }
    }  

    async function handleDeleteEvaluationSubmit(subject: { value: number }, momentIndex: number) {
        try {
          // Realiza a requisição para pegar as avaliações
          const response = await fetch('http://localhost:8080/app/evaluations?subjectId=' + subject.value);
          
          if (!response.ok) {
            throw new Error('Erro ao procurar avaliações para a unidade curricular.');
          }
      
          const evaluations = await response.json();
      
          const evaluation = evaluations.find((evaluation: any) => evaluation.evaluationPosition === momentIndex);
      
          if (!evaluation) {
            alert('Avaliação não encontrada para o momento especificado.');
            return;
          }
      
          const deleteResponse = await fetch('http://localhost:8080/app/evaluations/' + evaluation.evaluationId, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (deleteResponse.ok) {
            alert('Avaliação eliminada com sucesso! Pode preencher novamente.');
          } else {
            alert('Erro ao eliminar avaliação. Verifique se a avaliação existe.');
          }
      
        } catch (error) {
          alert('Erro na comunicação com o servidor: ' + error);
        }
    }  

    //Logoff
    const navigate = useNavigate();
    const handleLogoff = () => {
        navigate('/');
    };
  
// ------------------------------------------------------------------------------------------------------------------------
  
    return (
        <>

        {/* Fetch das cadeiras */}
        <FetchSubjects onFetchComplete={setSubjects} />

        <div>
        <h1>Departamento de Ciência e Tecnologia</h1>
        {user && (
            <h2>{userCourse || 'Curso não encontrado'}</h2>
        )}
        </div>

        <div className='user'>

        {/* Buttons principais */}
        <div className='buttons'>
            <button onClick={showEditCourse}>Editar curso</button>
            <button onClick={showEvaluationMap}>Mapa de avaliações</button>
        </div>
        
        {/* Edit course */}
        {isEditCShown && (
            <div className='editCourse'>
            <Form onSubmit={handleAddSubjectSubmit}>
                <Form.Group controlId='subjects'>
                <Select
                    isMulti
                    name="subjects"
                    options={subjectsByCourse}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    onChange={handleSubjectSelect}
                />

                {selectedSubjects.length > 0 && (
                    <div>
                    <text>Disciplinas selecionadas:</text>
                    <ul>
                        {selectedSubjects.map((subject) => (
                        <li key={subject.value}>
                            {subject.label}
                            <button
                            type="button"
                            onClick={() => handleRemoveSubject(subject)}
                            style={{ color: 'red' }}>Remover</button>
                        </li>
                        ))}
                    </ul>
                    {selectedSubjects.length > 1 && (
                        <button
                        type="button"
                        onClick={handleRemoveAllSubjects}
                        style={{ color: 'red', marginTop: '10px' }}
                        >
                        Remover todas as disciplinas
                        </button>
                    )}
                    </div>
                )}
                </Form.Group>

                <button type='button' onClick={showAddSubject}>Adicionar UC</button>

                {isAddSubjectShown && (
                <div className="addSubject">
                    <Form.Group controlId="subjectName">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                        type="text"
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                        />
                    </Form.Group>
                    
                    <Form.Group controlId="subjectYear">
                        <Form.Label>Ano</Form.Label>
                        <Form.Control
                        type="number"
                        value={subjectYear}
                        onChange={(e) => setSubjectYear(e.target.value)}
                        />
                    </Form.Group>
                    
                    <Form.Group controlId="subjectSemester">
                        <Form.Label>Semestre</Form.Label>
                        <Form.Control
                        type="number"
                        value={subjectSemester}
                        onChange={(e) => setSubjectSemester(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="numStudents">
                        <Form.Label>Número de Estudantes</Form.Label>
                        <Form.Control
                        type="number"
                        value={subjectStudentsEnrolled}
                        onChange={(e) => setSubjectStudentsEnrolled(e.target.value)}
                        />
                    </Form.Group>
                    <Button type="submit" disabled={!validateSubject()}>Adicionar</Button>
                </div>
                )}
            </Form>
            </div>
        )}


        {/* Evaluation Map */}
        {isEvalMapShown && (
            <>
            <div className='evaluationMap'>

            {/*Escolher semestre para a tabela*/}
            <div className="toggle-container">
            <button
                className={'toggle-button ' + (selectedSemester === '1º Semestre' ? 'active' : '')}
                onClick={() =>
                    toggleSemester('1º Semestre')
                }
                > 1º Semestre</button>

            <button
                className={'toggle-button ' + (selectedSemester === '2º Semestre' ? 'active' : '')}
                onClick={() =>
                    toggleSemester('2º Semestre')
                }
                > 2º Semestre</button>
            </div>

            <h2>Época normal</h2>
            <h3>{selectedSemester} 2024/2025</h3>

            <table className='table'>
                
                <thead>
                <tr>
                    <th>Ano</th>
                    <th>Unidade Curricular</th>
                    <th>Assiduidade (S/N)</th>
                    <th>Tipo de Avaliação</th>
                    <th>Elemento</th>
                    <th>Ponderação</th>
                    <th>Data</th>
                    <th>Sala</th>
                </tr>
                </thead>
                <tbody>
                {/* Filtrar as subjects filtradas por ano */}
                {[...new Set(subjectsByCourseSemester.map((subject) => subject.year))].map((year) => {
                    const subjectsInYear = subjectsByCourseSemester.filter((subject) => subject.year === year);
                    
                    return subjectsInYear.map((subject, index) => (
                    <>
                    <tr key={subject.value}>
                    {index === 0 && (
                        <td rowSpan={25}>{subject.year}º Ano</td>
                    )}
                    <td rowSpan={evaluationMoments.length + 1}>{subject.label}</td>

                    {/* Assiduidade */}
                    <td key={subject.value} rowSpan={evaluationMoments.length  + 1}>
                        <input type="text"          
                        value={subjectAttendance[subject.value] || ""}
                        onChange={(e) => {
                            setSubjectAttendance({
                            ...subjectAttendance,
                            [subject.value]: e.target.value,
                            });
                        }}
                        />
                    </td>

                    {/* Tipo de avaliação (mista ou contínua) */}
                    <td rowSpan={evaluationMoments.length  + 1}>
                        <Select
                        name="evalTypes"
                        options={evaluationTypes}
                        closeMenuOnSelect={true}
                        hideSelectedOptions={false}
                        value={evaluationTypes.find(option => option.value === subjectEvaluationType[subject.value])}
                        onChange={(selectedOption) => {
                            setSubjectEvaluationType(prevState => ({
                            ...prevState,
                            [subject.value]: selectedOption ? selectedOption.value : ''                       
                            }));
                        }}
                        />
                    </td>
                    </tr>

                    {/* Mapeamento dos momentos de avaliação */}
                    {evaluationMoments.map((_, momentIndex) => (
                        <tr key={'moment-' + subject.value + '-' + momentIndex}>
                        {/* Coluna de Elementos */}
                        <td key={'element-' + subject.value + '-' + momentIndex}>
                            <Select
                            name="elements"
                            options={elements}
                            closeMenuOnSelect={true}
                            hideSelectedOptions={false}
                            onChange={(selectedOption => setEvaluationElement(selectedOption ? selectedOption.value : ''))}
                            />
                        </td>

                        {/* Coluna de Ponderação */}
                        <td key={'weight-' + subject.value + '-' + momentIndex}>
                        <input
                            type="number"
                            value={evaluationWeight[`${subject.value}-${momentIndex}`] || ""}
                            onChange={(e) => {
                            setEvaluationWeight((prevState) => ({
                                ...prevState,
                                [`${subject.value}-${momentIndex}`]: parseInt(e.target.value) || null, // Garantir que o valor seja null se não for válido
                            }));
                            }}
                        />
                        </td>

                        <td key={'dateAndTime-' + subject.value + '-' + momentIndex}>
                            <DatePicker
                            selected={localDateTime[`${subject.value}-${momentIndex}`] || null}
                            dateFormat="d/MM/yyyy HH:mm:ss"
                            onChange={handleDateChange(subject.value, momentIndex)}
                            showTimeSelect
                            timeFormat="HH:mm:ss"
                            timeIntervals={30}
                            />
                        </td>


                        {/* Coluna de Sala de Aula */}
                        <td key={'classroom-' + subject.value + '-' + momentIndex}>
                            {evaluationClassrooms[`${subject.value}-${momentIndex}`] || "Sala não definida"}
                        </td>

                        {/* Botão para adicionar a avaliação */}
                        <td>
                        <button type="button" onClick={() => handleAddEvaluationSubmit(subject, momentIndex)}>✔</button>
                        </td>


                        {/* Botão para carregar a sala */}
                        <td>
                            <button
                            type="button"
                            onClick={() => handleLoadClassroomClick(subject.value, momentIndex)}
                            >
                            Carregar Sala
                            </button>
                        </td>

                        {/* Botão para apagar a avaliação */}
                        <td>
                        <button type="button" onClick={() => handleDeleteEvaluationSubmit(subject, momentIndex)}>❌</button>
                        </td>

                        </tr>
                        ))}
                    </>
                    ));
                })}
                </tbody>
            </table>

            <Form onSubmit={handleUpdateAllSubjects}>
                <button type="submit">Submeter</button>
            </Form>       
            </div>
            </>
        )}

        <button id="logoff" onClick={handleLogoff}>Logoff</button>

        </div>
    </>
    )
}

export default User;