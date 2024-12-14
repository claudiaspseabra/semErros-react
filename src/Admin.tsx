import './styles/Admin.css'
import './styles/Table.css'
import 'react-datepicker/dist/react-datepicker.css';

import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import DatePicker from 'react-datepicker';

import { default as Select } from "react-select";

import { evaluationTypes, evaluationMoments, elements } from './TableData.tsx'

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
      const response = await fetch('http://localhost:8080/app/subjects/delete/' + subjectToRemove.value, {
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

  const [dates, setDates] = useState<{ [key: string]: { date: Date | null, time: Date | null } }>({});

  const updateLocalDate = (subjectId: number, momentIndex: number, field: 'date' | 'time', newValue: Date) => {
    setDates(prevDates => ({
      ...prevDates,
      [`${subjectId}-${momentIndex}`]: {
        ...prevDates[`${subjectId}-${momentIndex}`],
        [field]: newValue
      }
    }));
  };

  const handleDateChange = (subjectId: number, momentIndex: number, field: 'date' | 'time') => (newDate: Date | null) => {
    if (newDate) {
      updateLocalDate(subjectId, momentIndex, field, newDate);
    }
  };
  

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

        <div className='evaluationMap'>

          <h1>{selectedCourseLabel}</h1>
          <h2>Época normal</h2>
          <h3>{selectedSemester} 2024/2025</h3>

          <table className="table">
            
            <thead>
              <tr>
                <th colSpan={4} className="empty"></th>
                {evaluationMoments.map((m, index) => (
                    <th key={index} colSpan={5}>{m.moment}</th>
                  ))}
              </tr>
              <tr>
                <th>Ano</th>
                <th>Unidade Curricular</th>
                <th>Assiduidade Obrigatória (S/N)</th>
                <th>Tipo de avaliação</th>

                {evaluationMoments.map(() => (
                    <>
                      <th key={'element-${index}'}>Elemento</th>
                      <th key={'ponderacao-${index}'}>Ponderação</th>
                      <th key={'date-${index}'}>Data</th>
                      <th key={'time-${index}'}>Hora</th>
                      <th key={'classroom-${index}'}>Sala</th>
                    </>
                  ))}
              </tr>
            </thead>
            <tbody>
              {/*Filtrar as subjects filtradas por ano*/}
              {[...new Set(subjectsByCourseSemester.map((subject) => subject.year))].map((year) => {
                const subjectsInYear = subjectsByCourseSemester.filter(
                  (subject) => subject.year === year
                )
                return subjectsInYear.map((subject, index) => (
                  <tr key={subject.value}>
                    {index === 0 && (
                      <td rowSpan={subjectsInYear.length}>{subject.year}º Ano</td>
                    )}
                    <td>{subject.label}</td>

                    {/*Não sei se daqui para baixo não terá de ser um form*/}

                    {/* Assiduidade */}
                    <td>
                      <input type="text"/>
                    </td>
                    {/* Tipo de avaliação (mista ou contínua) */}
                    <td>
                      <Select
                        name="evalTypes"
                        options={evaluationTypes}
                        closeMenuOnSelect={true}
                        hideSelectedOptions={false}
                      />
                    </td>
                    {/*Tipos de avaliações (teste, trabalho)*/}
                    {evaluationMoments.map((_, momentIndex) => (
                      <>
                        <td key={'element-${subject.value}-${momentIndex}'}>
                          <Select
                            name="elements"
                            options={elements}
                            closeMenuOnSelect={true}
                            hideSelectedOptions={false}
                          />
                        </td>
                        <td key={'ponderacao-${subject.value}-${momentIndex}'}>
                          <input type="text"/>
                        </td>
                        <td key={`date-${subject.value}-${momentIndex}`}>
                            <DatePicker
                              selected={dates[`${subject.value}-${momentIndex}`]?.date || null}
                              dateFormat="d/MM/yyyy"
                              onChange={handleDateChange(subject.value, momentIndex, 'date')}
                            />
                          </td>
                          <td key={`time-${subject.value}-${momentIndex}`}>
                            <DatePicker
                              showTimeSelect
                              showTimeSelectOnly
                              minTime={new Date(0, 0, 0, 8, 0)}
                              maxTime={new Date(0, 0, 0, 20, 0)}
                              selected={dates[`${subject.value}-${momentIndex}`]?.time || null}
                              dateFormat="h:mm a"
                              onChange={handleDateChange(subject.value, momentIndex, 'time')}
                            />
                          </td>
                        <td key={'classroom-${subject.value}-${momentIndex}'}>A-101</td>
                      </>
                    ))}
                    
                    <td>
                      <button type="button" >✔</button>
                    </td>
                  </tr>
                ))
              })}
            </tbody>
          </table>

          <button>Submeter</button>
        </div>
        </>
      )}

      <button id="logoff" onClick={handleLogoff}>Logoff</button>

      </div>
  </>
  )
}

export default Admin;