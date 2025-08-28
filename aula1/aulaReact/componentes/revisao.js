import React, {useState} from "react";
import { View,Text,TextInput, StyleSheet, Button } from "react-native";

const estilo = StyleSheet.create({
    input:{
        border: '1px solid black',
        margin: '5px'
    },
    label:{
        color: '#542318'
    }
});

const Alert=()=>{
    return(
        console.log('quero ir embora')
    )
}

const Campos=()=>{
    let label = "Nome: ";
    const [campo, setCampo] = useState("");

    return(
        <View>
            <Text style={[estilo.label, {fontSize:22}]}> { label } </Text>
            <TextInput style={estilo.input}
            onChangeText={(text)=>{setCampo(text)}}
            />
            <Button
            title="Ver"
            onPress={()=>{Alert()}}
            />
            <Text>Digitado { campo } </Text>
        </View>
    )
}

export default Campos;