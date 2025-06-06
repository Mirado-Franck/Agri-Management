import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function VenteChart() {
  const [ventesParSemaine, setVentesParSemaine] = useState([]);

  useEffect(() => {
    const fetchVentes = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/produits/ventes/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const ventes = await response.json();
        const ventesRegroupees = {};

        ventes.forEach(v => {
          const dateVente = new Date(v.date);
          const numeroSemaine = getNumeroSemaine(dateVente);
          const semaineKey = `Semaine ${numeroSemaine}`;

          ventesRegroupees[semaineKey] = (ventesRegroupees[semaineKey] || 0) + v.total;
        });

        const donneesTriees = Object.entries(ventesRegroupees).sort((a, b) => {
          const n1 = parseInt(a[0].split(' ')[1]);
          const n2 = parseInt(b[0].split(' ')[1]);
          return n1 - n2;
        });

        setVentesParSemaine(donneesTriees);
      } catch (error) {
        console.error("Erreur lors du chargement des ventes :", error);
      }
    };

    fetchVentes();
  }, []);

  const getNumeroSemaine = (date) => {
    const unJour = 86400000;
    const premierJanvier = new Date(date.getFullYear(), 0, 1);
    const joursDepuisDebutAnnee = Math.floor((date - premierJanvier) / unJour);
    return Math.ceil((joursDepuisDebutAnnee + premierJanvier.getDay() + 1) / 7);
  };

  const data = {
    labels: ventesParSemaine.map(v => v[0]),
    datasets: [{
      label: 'Total des ventes (€)',
      data: ventesParSemaine.map(v => v[1]),
      backgroundColor: [
        '#FF6B6B', // Rouge vibrant 🍒
        '#4ECDC4', // Turquoise frais 🌊
        '#FFD93D', // Jaune éclatant 🌞
        '#FF8C00', // Orange dynamique 🔥
        '#7C3AED', // Violet audacieux 💜
      ],
      borderColor: '#FFFFFF',
      borderWidth: 2,
      borderRadius: 4,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right', // Légendes à droite 📍
        labels: {
          boxWidth: 20,
          padding: 15,
          font: {
            size: 14,
            family: "'Arial', sans-serif",
          },
          color: '#1F2937',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: ctx => `${ctx.raw.toFixed(2)} €`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `${value} €`,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}