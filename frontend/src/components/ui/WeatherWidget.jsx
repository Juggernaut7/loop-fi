import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Thermometer, Sparkles } from 'lucide-react';
import LoopFundCard from './LoopFundCard';

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temperature: null,
    condition: 'sunny',
    location: 'Loading...',
    humidity: null,
    windSpeed: null
  });
  const [isLoading, setIsLoading] = useState(true);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return <Sun size={24} className="text-loopfund-gold-500" />;
      case 'cloudy':
        return <Cloud size={24} className="text-loopfund-neutral-500" />;
      case 'rainy':
        return <CloudRain size={24} className="text-loopfund-electric-500" />;
      case 'snowy':
        return <CloudSnow size={24} className="text-loopfund-lavender-500" />;
      case 'windy':
        return <Wind size={24} className="text-loopfund-neutral-400" />;
      default:
        return <Sun size={24} className="text-loopfund-gold-500" />;
    }
  };

  // Fetch real weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        
        // Get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Use a free weather API (you'll need to get an API key)
            // For now, we'll use a mock API call
            try {
              // Replace with actual weather API call
              // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=YOUR_API_KEY&units=imperial`);
              // const data = await response.json();
              
              // Mock data for now - replace with real API call
              setWeather({
                temperature: Math.floor(Math.random() * 30) + 50, // 50-80°F
                condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
                location: 'Your Location',
                humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
                windSpeed: Math.floor(Math.random() * 15) + 5 // 5-20 mph
              });
            } catch (error) {
              console.error('Weather API error:', error);
              // Fallback to default location
              setWeather({
                temperature: 72,
                condition: 'sunny',
                location: 'Default Location',
                humidity: 65,
                windSpeed: 8
              });
            }
          }, () => {
            // Geolocation failed, use default
            setWeather({
              temperature: 72,
              condition: 'sunny',
              location: 'Default Location',
              humidity: 65,
              windSpeed: 8
            });
          });
        } else {
          // Geolocation not supported
          setWeather({
            temperature: 72,
            condition: 'sunny',
            location: 'Default Location',
            humidity: 65,
            windSpeed: 8
          });
        }
      } catch (error) {
        console.error('Weather fetch error:', error);
        setWeather({
          temperature: 72,
          condition: 'sunny',
          location: 'Default Location',
          humidity: 65,
          windSpeed: 8
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <LoopFundCard className="p-6 dark:bg-loopfund-dark-surface dark:border-loopfund-dark-elevated">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
              Weather
            </h3>
            <p className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
              {weather.location}
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="p-2 bg-loopfund-electric-100 dark:bg-loopfund-electric-900/30 rounded-full"
          >
            {getWeatherIcon(weather.condition)}
          </motion.div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-loopfund-neutral-300 dark:border-loopfund-neutral-600 border-t-loopfund-electric-500 rounded-full"
            />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="p-2 bg-loopfund-gold-100 dark:bg-loopfund-gold-900/30 rounded-full"
                >
                  <Thermometer size={18} className="text-loopfund-gold-600 dark:text-loopfund-gold-400" />
                </motion.div>
                <span className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  {weather.temperature}°F
                </span>
              </div>
              <div className="text-right">
                <p className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                  Humidity: {weather.humidity}%
                </p>
                <p className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                  Wind: {weather.windSpeed} mph
                </p>
              </div>
            </div>
            
            <motion.div 
              className="mt-4 pt-4 border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="font-body text-body-xs text-loopfund-neutral-600 dark:text-loopfund-neutral-400 flex items-center">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="mr-2"
                >
                  ☀️
                </motion.span>
                Perfect weather for saving!
              </p>
            </motion.div>
          </>
        )}
      </LoopFundCard>
    </motion.div>
  );
};

export default WeatherWidget;