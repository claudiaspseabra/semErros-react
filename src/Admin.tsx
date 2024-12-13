import './styles/Admin.css'
import './styles/Table.css'

import React, {useState} from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { default as Select } from "react-select";

import { data, evaluationTypes, evaluationMoments, elements } from './Data.tsx'

import FetchCourses from './FetchCourses.tsx';
import FetchSubjects from './FetchSubjects.tsx';

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

  //Selecionar e apagar cadeiras
  const [selectedSubjects, setSelectedSubjects] = useState<{ value: number; label: string }[]>([]);
  const handleSubjectSelect = (selectedOptions: any) => {
    setSelectedSubjects(selectedOptions || []);
  };

  const handleRemoveSubject = (subjectToRemove: { value: number; label: string }) => {
    setSelectedSubjects((prev) =>
      prev.filter((subject) => subject.value !== subjectToRemove.value)
    );
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
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

  function validateUser() {
    return name.length > 0 && number.length > 0 && password.length > 0;
  }

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function validateCourse() {
    return name.length > 0 && number.length > 0 && password.length > 0;
  }

  const [subjectName, setSubjectName] = useState("");
  const [subjectSemester, setSubjectSemester] = useState("");
  const [subjectYear, setSubjectYear] = useState("");
  const [subjectStudentsEnrolled, setSubjectStudentsEnrolled] = useState("");

  const handleAddUCSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    setSubjectName("");
    setSubjectSemester("");
    setSubjectYear("");
    setSubjectStudentsEnrolled("");
  };
  
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
        <Form onSubmit={handleSubmit}>
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
                <Form.Label>Número</Form.Label>
                  <Form.Control
                      autoFocus
                      type="number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
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
              <Select
                  name="courses"
                  options={courses}
                  closeMenuOnSelect={true}
                  hideSelectedOptions={false}
                />
            <Button type="submit" disabled={!validateUser()}>Adicionar</Button>
          </Form>
        </div>
      )};
      
      {/* Edit course */}
      {isEditCShown && (
        <div className="editCourse">

          <Form onSubmit={handleSubmit}>
            <Select
              name="courses"
              options={courses}
              closeMenuOnSelect={true}
              hideSelectedOptions={false}
              onChange={(selectedOption) =>
                setSelectedCourse(selectedOption?.value || null)
              }
            />

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
                          style={{ color: 'red' }}
                        >
                          Remover
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

                <button onClick={showAddSubject}>Adicionar UC</button>
               </Form.Group>

            {isAddSubjectShown && (
              <div className="addSubject">
                <Form onSubmit={handleAddUCSubmit}>
                  <Form.Group controlId="ucName">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="ucSemester">
                    <Form.Label>Semestre</Form.Label>
                    <Form.Control
                      type="number"
                      value={subjectSemester}
                      onChange={(e) => setSubjectSemester(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="ucYear">
                    <Form.Label>Ano</Form.Label>
                    <Form.Control
                      type="number"
                      value={subjectYear}
                      onChange={(e) => setSubjectYear(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="numStudents">
                    <Form.Label>Número de Estudantes</Form.Label>
                    <Form.Control
                      type="number"
                      value={subjectStudentsEnrolled}
                      onChange={(e) => setSubjectStudentsEnrolled(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button type="submit" disabled={!subjectName || !subjectSemester || !subjectYear || !subjectStudentsEnrolled}>Adicionar</Button>
                  </Form>
              </div>
            )}

            <Button type="submit" disabled={!validateCourse()}>
              Editar
            </Button>
          </Form>
        </div>
      )};



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
                      <th key={'elemento-${index}'}>Elemento</th>
                      <th key={'ponderacao-${index}'}>Ponderação</th>
                      <th key={'data-${index}'}>Data</th>
                      <th key={'hora-${index}'}>Hora</th>
                      <th key={'sala-${index}'}>Sala</th>
                    </>
                  ))}
              </tr>
            </thead>
            <tbody>
              {/*Filtrar as subjects filtradas por ano*/}
              {[...new Set(subjectsByCourseSemester.map((subject) => subject.year))].map((year) => {
                const subjectsInYear = subjectsByCourseSemester.filter(
                  (subject) => subject.year === year
                );
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
                    {evaluationMoments.map(() => (
                      <>
                        <td key={'elemento-${subject.value}-${momentIndex}'}>
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
                        <td key={'data-${subject.value}-${momentIndex}'}>10/06/2025</td>
                        <td key={'hora-${subject.value}-${momentIndex}'}>14:00</td>
                        <td key={'sala-${subject.value}-${momentIndex}'}>A-101</td>
                      </>
                    ))}
                    
                    <td>
                      <button type="button" >✔</button>
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>

          <button>Submeter</button>
        </div>
        </>
      )};

      <button id="logoff">Logoff</button>

      </div>
  </>
  );
}

export default Admin;