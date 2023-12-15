create table users (
    id serial primary key ,
    nome text not null,
    email text not null,
    senha text not null,
    cpf text,
    telefone text
);

create table clients(
    cliente_id serial primary key,
    nome text not null,
    email text not null,
    cpf text not null,
    telefone text not null,
    cep text,
    logradouro text,
    complemento text,
    bairro text,
    cidade text,
    estado text,
    status text,
    criado_por integer references users(id),
    editado_por integer references users(id)
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table charges (
    cliente_id integer references clients(cliente_id),
    cobranca_id UUID default uuid_generate_v4() primary key,
    criado_por integer references users(id),
    editado_por integer references users(id),
    nome_cliente text not null,
    descricao text not null,
    status text,
    vencimento date not null,
    valor dec not null,
    cobranca_paga boolean,
    cobranca_pendente boolean,
    data_pagamento date 
);



