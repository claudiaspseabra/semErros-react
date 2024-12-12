import './styles/Admin.css'

import React, {useState} from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { default as Select } from "react-select";

import { data, evaluationTypes, evaluationMoments, elements, courses, subjects } from './Data.tsx'

function Admin() {

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

  function validateUser() {
    return name.length > 0 && number.length > 0 && password.length > 0;
  }

  const [course, setCourse] = useState("");
  const [uc, setUC] = useState("");

  function validateCourse() {
    return course.length > 0 && uc.length > 0;
  }

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  {/* Provavelmente há uma forma melhor*/}

  const [isAddUserShown, setIsAddUserShown] = useState(false);

  const showAddUser = () => {
    setIsAddUserShown(current => !current);
  }

  const [isEvalMapShown, setIsEvalMapShown] = useState(false);

  const showEvaluationMap = () => {
    setIsEvalMapShown(current => !current);
  }

  const [isEditCShown, setIsEditCShown] = useState(false);

  const showEditCourse = () => {
    setIsEditCShown(current => !current);
  }

  return (
    <>
    <h1>Departamento de Ciência e Tecnologia</h1>
    <div className='admin'>

      <div className='buttons'>
        <button onClick={showAddUser}>Criar coordenador</button>
        <button onClick={showEditCourse}>Editar curso</button>
        <button onClick={showEvaluationMap}>Mapa de avaliações</button>
      </div>


      {/* Add user - Desaparece se for um coordenador*/}
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
        <div className='editCourse'>
          <Form onSubmit={handleSubmit}>

            {/* Isto tem de desaparecer caso seja um coordenador porque ele só deve ter acesso ao seu curso */}
            <Select
              name="courses"
              options={courses}
              closeMenuOnSelect={true}
              hideSelectedOptions={false}
            />
            <Form.Group controlId="subjects">
              <Select
                isMulti
                name="subjects"
                options={subjects}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
              />
              <Form.Label>Nova UC</Form.Label>
                <Form.Control
                    autoFocus
                    type="text"
                    value={uc}
                    onChange={(e) => setUC(e.target.value)}
                />
            </Form.Group>
            <Button type="submit" disabled={!validateCourse()}>Editar</Button>
          </Form>
        </div>
      )};

      {/* Evaluation Map */}
      {isEvalMapShown && (
        <div className='evaluationMap'>
          <h1>Engenharia Informática</h1>
          <h2>Época normal</h2>
          <h3>1º Semestre 2024/2025</h3>
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

                {evaluationMoments.map((index) => (
                    <>
                      <th key={`elemento-${index}`}>Elemento</th>
                      <th key={`ponderacao-${index}`}>Ponderação/Observação</th>
                      <th key={`data-${index}`}>Data</th>
                      <th key={`hora-${index}`}>Hora</th>
                      <th key={`sala-${index}`}>Sala</th>
                    </>
                  ))}
              </tr>
            </thead>
            <tbody>
              

            {data.map((line, index) => (
                  <tr key={index}>
                    <td>{line.ano}</td>
                    {/*Adicionar conforme array ucs - verificar ano e colocar respetivamente*/}
                    <td>{line.unidadeCurricular}</td>
                    <td>
                      <input
                        type="text"
                      />
                    </td>
                    <td>
                    <Select
                      name="evalTypes"
                      options={evaluationTypes}
                      closeMenuOnSelect={true}
                      hideSelectedOptions={false}
                    />
                    </td>
                    {evaluationMoments.map((_, momentIndex) => (
                      <>
                        <td key={`select-element-${index}-${momentIndex}`}>
                          <Select
                            name="elements"
                            options={elements}
                            closeMenuOnSelect={true}
                            hideSelectedOptions={false}
                          />
                        </td>
                        <td>{line.ponderacao}</td>
                        <td>{line.data}</td>
                        <td>{line.hora}</td>
                        {/*Vai ser atribuído automaticamente*/}
                        <td>{line.sala}</td>
                      </>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      <button id="logoff">Logoff</button>

    </div>
  </>
  );
}

export default Admin;