import React, { useContext, useState, useEffect } from "react";

import {
  Background,
  Container,
  Nome,
  Saldo,
  Title,
  List,
  Area,
} from "./styles";
import { Platform, TouchableOpacity } from "react-native";

import { AuthContext } from "../../contexts/auth";
import HistoricoList from "../../components/HistoricoList";
import Header from "../../components/Header";
import firebase from "../../services/firebaseConnection";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { Alert } from "react-native";

import { format, isBefore } from "date-fns";

import DatePicker from "../../components/DatePicker";

export default function Home() {
  const [historico, setHistorico] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [show, setShow] = useState(false);
  const { user } = useContext(AuthContext);
  const uid = user && user.uid;

  const [newDate, setNewDate] = useState(new Date());
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
        .equalTo(format(newDate, "dd/MM/yyyy"))
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
  }, [newDate]);

  function handleDelete(data) {
    const [diaItem, mesItem, anoItem] = data.date.split("/");
    const dataItem = new Date(`${anoItem}/${mesItem}/${diaItem}`);
    console.log(dataItem);

    // data de hoje

    const formatDiaHoje = format(new Date(), "dd/MM/yyyy");
    const [diaHoje, mesHoje, anoHoje] = formatDiaHoje.split("/");
    const dataHoje = new Date(`${anoItem}/${mesItem}/${diaItem}`);
    if (isBefore(dataItem, dataHoje)) {
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
          onPress: () => handleDeleteSuccess(data),
        },
      ]
    );
  }

  async function handleDeleteSuccess(data) {
    await firebase
      .database()
      .ref("historico")
      .child(uid)
      .child(data.key)
      .remove()
      .then(async () => {
        let saldoAtual = saldo;
        data.tipo === "despesa"
          ? (saldoAtual += parseFloat(data.valor))
          : (saldoAtual -= parseFloat(data.valor));

        await firebase
          .database()
          .ref("users")
          .child(uid)
          .child("saldo")
          .set(saldoAtual);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleShowPicker() {
    setShow(true);
  }
  function handleClose() {
    setShow(true);
  }
  const onChange = (date) => {
    setShow(Platform.OS === "ios");
    setNewDate(date);
  };
  return (
    <Background>
      <Header />
      <Container>
        <Nome>{user && user.nome}</Nome>
        <Saldo>
          R$:{saldo.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
        </Saldo>
      </Container>
      <Area>
        <TouchableOpacity onPress={handleShowPicker}>
          <Icon name="calendar" size={30} color="#ffffff" />
        </TouchableOpacity>
        <Title>Ultimas Movimentações</Title>
      </Area>
      <List
        showsVerticalScrollIndicator={false}
        data={historico}
        keyExtrator={(item) => item.key}
        renderItem={({ item }) => (
          <HistoricoList data={item} deleteItem={handleDelete} />
        )}
      />
      {show && (
        <DatePicker onClose={handleClose} date={newDate} onChange={onChange} />
      )}
    </Background>
  );
}
