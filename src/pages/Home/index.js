import React, { useContext, useState, useEffect } from "react";

import { Background, Container, Nome, Saldo, Title, List } from "./styles";
import { AuthContext } from "../../contexts/auth";
import HistoricoList from "../../components/HistoricoList";
import Header from "../../components/Header";
import firebase from "../../services/firebaseConnection";

import { Alert } from "react-native";

import { format, isPast } from "date-fns";

export default function Home() {
  const [historico, setHistorico] = useState([]);
  const [saldo, setSaldo] = useState(0);

  const { user } = useContext(AuthContext);
  const uid = user && user.uid;

  useEffect(() => {
    async function loadList() {
      await firebase
        .database()
        .ref("users")
        .child(uid)
        .on("value", (snapshot) => {
          setSaldo(snapshot.val().saldo);
        });

      await firebase
        .database()
        .ref("historico")
        .child(uid)
        .orderByChild("date")
        .equalTo(format(new Date(), "dd/MM/yyyy"))
        .limitToLast(10)
        .on("value", (snapshot) => {
          setHistorico([]);

          snapshot.forEach((childItem) => {
            let list = {
              key: childItem.key,
              tipo: childItem.val().tipo,
              valor: childItem.val().valor,
              date: childItem.val().date,
            };

            setHistorico((oldArray) => [...oldArray, list].reverse());
          });
        });
    }
    loadList();
  }, []);

  function handleDelete(data) {
    if (isPast(new Date(data.date))) {
      alert("Sem Permissão!");

      return;
    }
    Alert.alert(
      "Atenção",
      `Você deseja excluir Tipo: ${data.tipo} Valor: ${data.valor}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Continuar",
          onPress: () => handleDeleteSuccess(data)
        },
      ]
    );
  }

  async function handleDeleteSuccess(data){
     await firebase.database().ref('historico')
     .child(uid).child(data.key).remove()
     .then( async ()=>{
      let saldoAtual = saldo
      data.tipo ==='despesa'? saldoAtual += parseFloat(data.valor): saldoAtual -= parseFloat(data.valor)

      await firebase.database().ref('users').child(uid)
      .child('saldo').set(saldoAtual)
     })
     .catch((error)=>{
      console.log(error)
     })
  }
  return (
    <Background>
      <Header />
      <Container>
        <Nome>{user && user.nome}</Nome>
        <Saldo>
          R$:{saldo.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
        </Saldo>
      </Container>
      <Title>Ultimas Movimentações</Title>
      <List
        showsVerticalScrollIndicator={false}
        data={historico}
        keyExtrator={(item) => item.key}
        renderItem={({ item }) => (
          <HistoricoList data={item} deleteItem={handleDelete} />
        )}
      />
    </Background>
  );
}
