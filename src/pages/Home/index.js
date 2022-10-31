import React, { useContext, useState } from "react";

import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";
import HistoricoList from "../../components/HistoricoList";

import { Background, Container, Nome, Saldo, Title, List } from "./styles";
export default function Home() {
  const { user } = useContext(AuthContext);
  const [historico, setHistorico] = useState([
    { key: "1", tipo: "receita", valor: 11200 },
    { key: "2", tipo: "despesa", valor: 1200 },
    { key: "3", tipo: "despesa", valor: 3200 },
    { key: "4", tipo: "receita", valor: 1200 },
    { key: "5", tipo: "receita", valor: 11200 },
    { key: "6", tipo: "despesa", valor: 1200 },
    { key: "7", tipo: "despesa", valor: 3200 },
    { key: "8", tipo: "receita", valor: 1200 },
    { key: "9", tipo: "receita", valor: 11200 },
    { key: "10", tipo: "despesa", valor: 1200 },
    { key: "11", tipo: "despesa", valor: 3200 },
    { key: "12", tipo: "receita", valor: 1200 },
  ]);
  return (
    <Background>
      <Header />
      <Container>
        <Nome>Elvis</Nome>
        <Saldo>R$:15000</Saldo>
      </Container>
      <Title>Ultimas Movimentações</Title>
      <List
        showsVerticalScrollIndicator={false}
        data={historico}
        keyExtrator={(item) => item.key}
        renderItem={({ item }) =>( <HistoricoList data={item}/>)}
      />
    </Background>
  );
}
