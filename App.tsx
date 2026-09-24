import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Enano = {
  id: number;
  nombre: string;
  edad: number;
};

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export default function App() {
  const [enanos, setEnanos] = useState<Enano[]>([]);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");

  const cargarEnanos = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/enanos`);

      const datos = await respuesta.json();

      setEnanos(datos);
    } catch (error) {
      console.log("Error al cargar:", error);
    }
  };

  useEffect(() => {
    cargarEnanos();
  }, []);

  const agregarEnano = async () => {
    if (nombre.trim() === "" || edad.trim() === "") {
      Alert.alert("Error", "Ingresá nombre y edad");
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/enanos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre,
          edad: Number(edad),
        }),
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo crear");
      }

      const nuevoEnano: Enano = await respuesta.json();

      setEnanos([...enanos, nuevoEnano]);

      setNombre("");
      setEdad("");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo agregar el enano");
    }
  };

  const eliminarEnano = async (id: number) => {
    try {
      const respuesta = await fetch(`${API_URL}/enanos/${id}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar");
      }

      setEnanos(enanos.filter((enano) => enano.id !== id));
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo eliminar el enano");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Lista de Enanos</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del enano"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Edad del enano"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
      />

      <Pressable style={styles.botonAgregar} onPress={agregarEnano}>
        <Text style={styles.textoBoton}>Agregar Enano</Text>
      </Pressable>

      <FlatList
        data={enanos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <Text style={styles.nombre}>{item.nombre}</Text>

            <Text style={styles.edad}>Edad: {item.edad}</Text>

            <Pressable
              style={styles.botonEliminar}
              onPress={() => eliminarEnano(item.id)}
            >
              <Text style={styles.textoBoton}>Eliminar</Text>
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#ffffff",
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },

  botonAgregar: {
    backgroundColor: "#333333",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },

  tarjeta: {
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },

  nombre: {
    fontSize: 20,
    fontWeight: "bold",
  },

  edad: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
  },

  botonEliminar: {
    backgroundColor: "#b3261e",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },

  textoBoton: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});