{/* Exemplo - fazer funcionar sem isto */}
export const data = [
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
  
export const evaluationTypes = [
    {value: "contínua", label: "contínua"},
    {value: "mista", label: "mista"}
]


export const evaluationMoments = [
    { moment: "1º Elemento de Avaliação" },
    { moment: "2º Elemento de Avaliação" },
    { moment: "3º Elemento de Avaliação" },
    { moment: "4º Elemento de Avaliação" }
];
  
export const elements = [
    { value: "Teste", label: "Teste" },
    { value: "Mini teste", label: "Mini teste" },
    { value: "Teste final na Época de Exames", label: "Teste final na Época de Exames" },
    { value: "Trabalho(s) desenvolvido(s) ao longo do semestre", label: "Trabalho(s) desenvolvido(s) ao longo do semestre" },
    { value: "Entrega de Trabalho", label: "Entrega de Trabalho" },
    { value: "Entrega de Trabalho de Grupo", label: "Entrega de Trabalho de Grupo" },
    { value: "Monografia", label: "Monografia" },
    { value: "Exercício Prático Individual", label: "Exercício Prático Individual" },
    { value: "Pitch", label: "Pitch" },
    { value: "Exame Final", label: "Exame Final" },
    { value: "Prova Oral", label: "Prova Oral" }
];
  
{/* Só tem as cadeiras de EI */}
export const subjects = [
    { ano: "1", value: "ALGA", label: "ALGA"},
    { ano: "1", value: "AP", label: "AP"},
    { ano: "1", value: "AOC", label: "AOC"},
    { ano: "1", value: "AM", label: "AM"},
    { ano: "1", value: "CC", label: "CC"},
    { ano: "2", value: "EA", label: "EA"},
    { ano: "2", value: "AED", label: "AED"},
    { ano: "2", value: "SO", label: "SO"},
    { ano: "2", value: "LP", label: "LP"},
    { ano: "2", value: "ER", label: "ER"},
    { ano: "3", value: "IA", label: "IA"},
    { ano: "3", value: "QS", label: "QS"},
    { ano: "3", value: "EMP", label: "EMP"},
    { ano: "3", value: "GP", label: "GP"}
];

export const courses = [
    { value: "Engenharia e Gestão Industrial", duration: "3", label: "Engenharia e Gestão Industrial"},
    { value: "Engenharia Informática", label: "Engenharia Informática"},
    { value: "Sistemas de Informação para Gestão", label: "Sistemas de Informação para Gestão"}
];