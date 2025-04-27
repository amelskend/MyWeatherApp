import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TextInput, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('Alger'); // Ville par défaut
  const [inputCity, setInputCity] = useState(''); // Ville entrée par l'utilisateur
  const [suggestions, setSuggestions] = useState([]); // Suggestions de villes

  const API_KEY = '533aea9f96227bbd17f32d7fe3d541fc'; // Remplacez par votre clé API OpenWeatherMap

  // Liste de villes prédéfinies
  const cities = ['Alger','Draa Ben Khedda', 'Bejaia', 'Tizi Ouzou', 'Oran', 'Constantine', 'Annaba', 'Batna', 'Setif', 'Blida'];

  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      setWeatherData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  // Filtrer les suggestions en fonction de l'entrée
  const handleInputChange = (text) => {
    setInputCity(text);
    if (text.length > 0) {
      const filteredCities = cities.filter((c) =>
        c.toLowerCase().startsWith(text.toLowerCase())
      );
      setSuggestions(filteredCities);
    } else {
      setSuggestions([]);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E7E7EB" />
        <Text style={styles.loadingText}>Loading Weather...</Text>
      </View>
    );
  }

  const { name } = weatherData;
  const { temp } = weatherData.main;
  const { description, icon } = weatherData.weather[0];

  return (
    <View style={styles.container}>
      {/* Conteneur pour le champ de saisie et l'icône */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter city name"
          placeholderTextColor="#A09FB1"
          value={inputCity}
          onChangeText={handleInputChange}
        />
        <TouchableOpacity onPress={() => setCity(inputCity)} style={styles.iconContainer}>
          <Icon name="search" size={30} color="#E7E7EB" />
        </TouchableOpacity>
      </View>

      {/* Suggestions de villes */}
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => { setInputCity(item); setSuggestions([]); }}>
              <Text style={styles.suggestion}>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsList}
        />
      )}

      {/* Weather Location */}
      <Text style={styles.location}>{name}</Text>

      {/* Weather Icon */}
      <Image
        source={{
          uri: `https://openweathermap.org/img/wn/${icon}@4x.png`,
        }}
        style={styles.weatherIcon}
      />

      {/* Temperature */}
      <Text style={styles.temperature}>{Math.round(temp)}°C</Text>

      {/* Weather Description */}
      <Text style={styles.description}>{description.charAt(0).toUpperCase() + description.slice(1)}</Text>

      {/* Weather Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Humidity:</Text>
          <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Wind:</Text>
          <Text style={styles.detailValue}>{weatherData.wind.speed} m/s</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Pressure:</Text>
          <Text style={styles.detailValue}>{weatherData.main.pressure} hPa</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E213A',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#E7E7EB',
  },
  inputContainer: {
    flexDirection: 'row', // Aligne le champ et l'icône horizontalement
    alignItems: 'center',
    width: '80%',
    marginBottom: 90,
    paddingHorizontal: 5, // Ajoute un espacement interne
  },
  input: {
    flex: 1, // Le champ prend tout l'espace disponible
    height: 40,
    borderColor: '#A09FB1',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#E7E7EB',
    backgroundColor: '#2C2C44',
    fontSize: 16,
  },
  searchIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    tintColor: '#E7E7EB', // Change la couleur de l'icône
  },
  suggestionsList: {
    width: '80%',
    backgroundColor: '#2C2C44',
    borderRadius: 5,
    marginBottom: 10,
  },
  suggestion: {
    padding: 10,
    fontSize: 16,
    color: '#E7E7EB',
    borderBottomWidth: 1,
    borderBottomColor: '#A09FB1',
  },
  location: {
    fontSize: 32,
    fontWeight: '600',
    color: '#E7E7EB',
    marginBottom: 20,
  },
  weatherIcon: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  temperature: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#E7E7EB',
    marginBottom: 10,
  },
  description: {
    fontSize: 24,
    fontWeight: '400',
    color: '#A09FB1',
    marginBottom: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 100,
    paddingVertical: 20,
    backgroundColor: '#100E1D',
    borderRadius: 10,
  },
  detail: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 16,
    color: '#A09FB1',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E7E7EB',
  },
});

export default WeatherApp;