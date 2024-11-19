import './Table.css'
import {useState} from 'react';

const data = [
  {
    ano: "1º ano",
    unidadeCurricular: "Algoritmia e Programação",
    assiduidade: "N",
    elemento: "Teste",
    ponderacao: "50% e nota mínima 7 valores",
    data: "04-11-2024",
    hora: "10h",
    sala: "Aula 101"
  },
  {
    ano: "2º ano",
    unidadeCurricular: "Engenharia de Software",
    assiduidade: "S",
    elemento: "Projeto",
    ponderacao: "40%",
    data: "15-11-2024",
    hora: "14h",
    sala: "Lab 3"
  }
];

const evaluationMoments = [
  { moment: "1º Elemento de Avaliação" },
  { moment: "2º Elemento de Avaliação" },
  { moment: "3º Elemento de Avaliação" },
  { moment: "4º Elemento de Avaliação" }
];

const elements = [
  { element: "Teste" },
  { element: "Mini teste" },
  { element: "Teste final na Época de Exames" },
  { element: "Trabalho(s) desenvolvido(s) ao longo do semestre" },
  { element: "Entrega de Trabalho" },
  { element: "Entrega de Trabalho de Grupo" },
  { element: "Monografia" },
  { element: "Exercício Prático Individual" },
  { element: "Pitch" },
  { element: "Exame Final" },
  { element: "Prova Oral" }
]

const ucs = [
  { ano: "1" , uc: "ALGA"},
  { ano: "1", uc: "AP"},
  { ano: "1", uc: "AOC"},
  { ano: "1", uc: "AM"},
  { ano: "1", uc: "CC"},
  { ano: "2" , uc: "EA"},
  { ano: "2", uc: "AED"},
  { ano: "2", uc: "SO"},
  { ano: "2", uc: "LP"},
  { ano: "2", uc: "ER"},
  { ano: "3", uc: "IA"},
  { ano: "3", uc: "QS"},
  { ano: "3", uc: "EMP"},
  { ano: "3", uc: "GP"}
]

function Admin() {

  const [isShown, setIsShown] = useState(false);

  const showEvaluationMap = event => {
    setIsShown(current => !current);
  }

  return (
    <>
    <div className='admin'>

      <div className='buttons'>
        <button>Adicionar curso</button>
        <button>Editar curso</button>
        <button onClick={showEvaluationMap}>Mapa de avaliações</button>
      </div>


      {/* Evaluation Map */}
      {isShown && (
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
                      <select>
                        <option value="Mista">Mista</option>
                        <option value="Contínua">Contínua</option>
                      </select>
                    </td>
                    {evaluationMoments.map((_, momentIndex) => (
                      <>
                        <td key={`select-element-${index}-${momentIndex}`}>
                          <select>
                            {elements.map((el, elIndex) => (
                              <option key={elIndex} value={el.element}>
                                {el.element}
                              </option>
                            ))}
                          </select>
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