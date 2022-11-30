import { View, Text, Image } from "react-native";
import React, { useContext } from "react";

import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AuthContext } from "../../contexts/auth";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function CustomDrawer(props) {
  const { user, signOut } = useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props} style={{ flex: 1 }}>
      <View style={{ flexDirection: "column" }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 25,
          }}
        >
          <Image
            source={require("../../assets/Logo.png")}
            style={{ width: 85, height: 85 }}
            resizeMode="contain"
          />
          <Text style={{ color: "#FFF", fontSize: 18, marginTop: 5 }}>
            Bem-Vindo
          </Text>
          <Text
            style={{
              color: "#FFF",
              fontSize: 18,
              fontWeight: "bold",
              marginTop: 5,
              paddingBottom: 25,
            }}
          >
            " {user.nome} "
          </Text>
        </View>
        <DrawerItemList {...props} />
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            padding: 5,
            marginTop: 10,
            marginHorizontal: 15,
            borderWidth: 2,
            borderColor: "#00b94a",
            width: 70,
            borderRadius:10
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}

            onPress={()=> signOut()}
          >
            <Text style={{ color: "#FFF", fontWeight: "bold", marginRight: 5 }}>
              Sair
            </Text>
            <Icon name="logout" color="#fff" size={30} />
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}
