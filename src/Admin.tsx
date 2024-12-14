import './styles/Admin.css'
import './styles/Table.css'
import 'react-datepicker/dist/react-datepicker.css';

import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import DatePicker from 'react-datepicker';

import { default as Select } from "react-select";

import { evaluationTypes, evaluationMoments, elements } from './Data.tsx'

import FetchCourses from './Fetch/FetchCourses.tsx';
import FetchSubjects from './Fetch/FetchSubjects.tsx';

function Admin() {

  // Fetchs
  const [courses, setCourses] = useState<{ value: number; label: string }[]>([]);
  const [subjects, setSubjects] = useState<{ value: number; course: number; year: number; semester: number; label: string }[]>([]);


  // Obter id do curso
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedCourseLabel, setSelectedCourseLabel] = useState<string | null>(null);

  // Obter cadeiras do curso selecionado
  const subjectsByCourse = subjects.filter(
    (subject) => subject.course === selectedCourse
  );

  //Selecionar cadeiras
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
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  function validateUser() {
    return name.length > 0 && username.length > 0 && password.length > 0;
  }

  async function handleUserSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const userData = {
      name,
      username,
      password
    };
    
    try {
      const response = await fetch('http://localhost:8080/app/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (response.ok) {
        alert('Coordenador criado com sucesso!');
        setName('');
        setUserName('');
        setPassword('');
      } else {
        alert('Erro ao criar coordenador!');
      }
    } catch (error) {
      alert('Erro na comunicação com o servidor.');
    }
  }

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
        alert('Erro ao remover Unidade Curricular.');
      }
    } catch (error) {
      alert('Erro na comunicação com o servidor!');
    }
  }

  const handleRemoveAllSubjects = async () => {
    const confirmDelete = window.confirm(
      'Tem a certeza que deseja remover todas as disciplinas selecionadas?'
    );
  
    if (!confirmDelete) return;
  
    for (const subject of selectedSubjects) {
      try {
        const response = await fetch(
          'http://localhost:8080/app/subjects/delete/' + subject.value,
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
        } else {
          alert('Erro ao remover Unidade Curricular: ' + subject.label);
        }
      } catch (error) {
        alert('Erro na comunicação com o servidor.');
      }
    }
  
    alert('Todas as unidades curriculares foram removidas com sucesso!');
  }

  const [subjectName, setSubjectName] = useState("");
  const [subjectSemester, setSubjectSemester] = useState("");
  const [subjectYear, setSubjectYear] = useState("");
  const [subjectStudentsEnrolled, setSubjectStudentsEnrolled] = useState("");

  function validateSubject() {
    return subjectName.length > 0 && subjectSemester.length > 0 && subjectYear.length > 0 && subjectStudentsEnrolled.length > 0;
  }

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
        alert('Curso editado com sucesso!');
        setSubjectName('');
        setSubjectSemester('');
        setSubjectYear('');
        setSubjectStudentsEnrolled('');
      } else {
        alert('Erro ao editar o curso!');
      }
    } catch (error) {
      alert(error);
    }
  }

  // Aparecer e desaparecer on button click
    // Adicionar utilizador
  const [isAddUserShown, setIsAddUserShown] = useState(false);
  const showAddUser = () => {
    setIsAddUserShown(current => !current);
  }

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

  //Logoff
  const navigate = useNavigate();
  const handleLogoff = () => {
    localStorage.removeItem('user');

    navigate('/');
  };

  // Update attendance e evaluationType do subject
  const [subjectAttendance, setSubjectAttendance] = useState<{ [key: number]: string }>({});
  const [subjectEvaluationType, setSubjectEvaluationType] = useState<{ [key: number]: string }>({});

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

  async function handleAddEvaluationSubmit(subject: { value: number; course: number }, momentIndex: number) {
    const newEvaluation = {
      "evaluationType": evaluationElement,
      "courseId": subject.course,
      "evaluationWeight": evaluationWeight[`${subject.value}-${momentIndex}`] || 0,
      "evaluationDate": evaluationDate,
      "evaluationHour": evaluationTime,
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
  
  

  // -----------------------------------------------------------------------------------------------------------------
  
  return (
    <>
      
    {/* Fetch dos cursos e das cadeiras */}
    <FetchCourses onFetchComplete={setCourses} />
    <FetchSubjects onFetchComplete={setSubjects} />


    <h1>Departamento de Ciência e Tecnologia</h1>
    <div className='admin'>

      {/* Buttons principais */}
      <div className='buttons'>
        <button onClick={showAddUser}>Criar coordenador</button>
        <button onClick={showEditCourse}>Editar curso</button>
        <button onClick={showEvaluationMap}>Mapa de avaliações</button>
      </div>


      {/* Add user - Desaparecer se for um coordenador*/}
      {isAddUserShown && (
        <div className='addUser'>
        <Form onSubmit={handleUserSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Nome</Form.Label>
                <Form.Control
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </Form.Group>
              <Form.Group controlId="number">
                <Form.Label>Username</Form.Label>
                  <Form.Control
                      autoFocus
                      type="text"
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                  />
              </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
                  <Form.Control
                      autoFocus
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>
            <Button type="submit" disabled={!validateUser()}>Adicionar</Button>
          </Form>
        </div>
      )}
      
      {/* Edit course */}
      {isEditCShown && (
        <div className="editCourse">
          <Form onSubmit={handleAddSubjectSubmit}>
            <Form.Group controlId="courses">
              <Select
                name="courses"
                options={courses}
                closeMenuOnSelect={true}
                hideSelectedOptions={false}
                onChange={(selectedOption) =>
                  setSelectedCourse(selectedOption?.value || null)
                }
              />
            </Form.Group>

            <Form.Group controlId="subjects">
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

            {isAddSubjectShown && selectedCourse && (
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
          {/*Escolher curso para a tabela*/}
          <Select
            name="courses"
            options={courses}
            closeMenuOnSelect={true}
            hideSelectedOptions={false}
            onChange={(selectedOption) => 
              {
              setSelectedCourse(selectedOption?.value || null)
              setSelectedCourseLabel(selectedOption?.label || null)
              }
            }
          />

          {/*Escolher semestre para a tabela*/}
          <div className="toggle-container">
          <button
              className={`toggle-button ${selectedSemester === '1º Semestre' ? 'active' : ''}`}
              onClick={() =>
                toggleSemester('1º Semestre')
              }
            > 1º Semestre</button>

          <button
              className={`toggle-button ${selectedSemester === '2º Semestre' ? 'active' : ''}`}
              onClick={() =>
                toggleSemester('2º Semestre')
              }
            > 2º Semestre</button>
          </div>

          <h1>{selectedCourseLabel}</h1>
          <h2>Época normal</h2>
          <h3>{selectedSemester} 2024/2025</h3>

          <table className="table">
            
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
                    <tr key={`moment-${subject.value}-${momentIndex}`}>
                      {/* Coluna de Elementos */}
                      <td key={`element-${subject.value}-${momentIndex}`}>
                        <Select
                          name="elements"
                          options={elements}
                          closeMenuOnSelect={true}
                          hideSelectedOptions={false}
                          onChange={(selectedOption => setEvaluationElement(selectedOption ? selectedOption.value : ''))}
                        />
                      </td>

                      {/* Coluna de Ponderação */}
                      <td key={`ponderacao-${subject.value}-${momentIndex}`}>
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

                      <td key={`date-time-${subject.value}-${momentIndex}`}>
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
                      <td>
                      </td>

                      {/* Botão para exibir a Data e Hora */}
                      <td>
                      <button 
                        onClick={() => {
                          alert(`Data: ${formatDate(localDate[`${subject.value}-${momentIndex}`])}`);
                          alert(`Hora: ${formatTime(localTime[`${subject.value}-${momentIndex}`])}`);
                        }}>                          
                        Ver Data e Hora
                        </button>
                      </td>
                      <td><button type="button" onClick={() => handleAddEvaluationSubmit(subject, momentIndex)}>✔</button></td>
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

export default Admin;