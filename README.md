# 🌾 Agro Manager

Plataforma full stack para gestão de propriedades agrícolas, desenvolvida com **NestJS** no backend e **Next.js** no frontend, utilizando **PostgreSQL** como banco de dados. Toda a aplicação foi dockerizada por meio de um `docker-compose`, com serviços para o banco de dados, backend, frontend e também o Prisma Studio.

A proposta do sistema é permitir o cadastro e gerenciamento de produtores rurais e suas respectivas propriedades, com validações específicas para CPF/CNPJ, controle das áreas da fazenda e registro de culturas por safra.

A aplicação utiliza **React Hook Form** para manipulação de formulários, em conjunto com o **Yup** para validação de dados. Também faz uso da biblioteca **cpf-cnpj-validator** para validar documentos e da **Recharts** para exibição de gráficos no dashboard administrativo.

#### O cadastro dos produtores inclui os seguintes dados:

- CPF ou CNPJ  
- Nome do produtor  
- Nome da fazenda (propriedade)  
- Cidade  
- Estado  
- Área total da fazenda (em hectares)  
- Área agricultável (em hectares)  
- Área de vegetação (em hectares)  
- Safras (ex: 2021, 2022)  
- Culturas plantadas (ex: Soja na Safra 2021, Milho na Safra 2021, Café na Safra 2022)


## 🛠 Tecnologias

- ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
- ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

- ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
- ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
- ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)



## ✨ Funcionalidades

- Cadastro e autenticação de usuários.
- Validação do CPF ou CNPJ fornecido pelo usuário.
- Cadastro, edição e exclusão de propriedades. 
- Garante que a soma das áreas agricultável e de vegetação não ultrapasse a área total da fazenda.
- Permite o registro de várias culturas plantadas por fazenda do produtor.
- Um produtor pode estar associado a 0, 1 ou mais propriedades rurais.
- Uma propriedade rural pode ter 0, 1 ou mais culturas plantadas por safra.
 ### 📊 Dashboard da área do administrador que mostra:
- Total de fazendas cadastradas (quantidade).
- Total de hectares registrados (área total).
- Gráficos de pizza:
- Por estado.
- Por cultura plantada.
- Por uso do solo (área agricultável e vegetação).

## 🖥️ Visão geral
### Página inicial
 <img src='frontend/public/screen.png' width='500px'  /> 

 ### Página do administrador

 <img src='frontend/public/screen-dashboard.png' width='500px'/> 

 ### Formulário login

 <img src='frontend/public/screen-login.png' width='500px'/> 

 ### Formulário de cadastro

<img src='frontend/public/screen-register.png' width='500px'/> 

### Formulário cadastro de fazendas

<img src='frontend/public/overview-form-farm.gif' width='500px'/> 




