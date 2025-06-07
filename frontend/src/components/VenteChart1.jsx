import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function VenteChart1() {
  const [ventes, setVentes] = useState([]);
  const [ventesGroupees, setVentesGroupees] = useState([]);
  const [periode, setPeriode] = useState('semaine');
  const [dateSpecifique, setDateSpecifique] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchVentes = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/produits/ventes/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const ventesData = await response.json();
        setVentes(ventesData);
        regrouperVentes(ventesData, periode, dateSpecifique);
      } catch (error) {
        console.error("Erreur lors du chargement des ventes :", error);
      }
    };

    fetchVentes();
  }, [periode, dateSpecifique]);

  const regrouperVentes = (ventesData, groupBy, specificDate) => {
    const ventesRegroupees = {};
    const dateSpec = new Date(specificDate);

    ventesData.forEach(v => {
      const dateVente = new Date(v.date);
      
      // Filtrage par date si nécessaire
      if (groupBy === 'jour' && !isMemeJour(dateVente, dateSpec)) {
        return;
      }
      if (groupBy === 'mois' && !isMemeMois(dateVente, dateSpec)) {
        return;
      }
      if (groupBy === 'trimestre' && !isMemeTrimestre(dateVente, dateSpec)) {
        return;
      }
      if (groupBy === 'annee' && dateVente.getFullYear() !== dateSpec.getFullYear()) {
        return;
      }

      let key;
      switch (groupBy) {
        case 'jour':
          key = `${dateVente.getDate()}/${dateVente.getMonth() + 1}`;
          break;
        case 'semaine':
          key = `Semaine ${getNumeroSemaine(dateVente)}`;
          break;
        case 'mois':
          key = `${getNomMois(dateVente)} ${dateVente.getFullYear()}`;
          break;
        case 'trimestre':
          key = `T${Math.floor(dateVente.getMonth() / 3) + 1} ${dateVente.getFullYear()}`;
          break;
        case 'annee':
          key = dateVente.getFullYear().toString();
          break;
        default:
          key = `Semaine ${getNumeroSemaine(dateVente)}`;
      }

      ventesRegroupees[key] = (ventesRegroupees[key] || 0) + v.total;
    });

    const donneesTriees = Object.entries(ventesRegroupees).sort((a, b) => {
      // Tri selon la période
      if (groupBy === 'jour') {
        return new Date(a[0].split('/').reverse().join('-')) - new Date(b[0].split('/').reverse().join('-'));
      } else if (groupBy === 'semaine') {
        return parseInt(a[0].split(' ')[1]) - parseInt(b[0].split(' ')[1]);
      } else if (groupBy === 'mois') {
        return getNumeroMois(a[0].split(' ')[0]) - getNumeroMois(b[0].split(' ')[0]);
      } else if (groupBy === 'trimestre') {
        return a[0].localeCompare(b[0]);
      } else { // année
        return parseInt(a[0]) - parseInt(b[0]);
      }
    });

    setVentesGroupees(donneesTriees);
  };

  // Fonctions utilitaires
  const getNumeroSemaine = (date) => {
    const unJour = 86400000;
    const premierJanvier = new Date(date.getFullYear(), 0, 1);
    const joursDepuisDebutAnnee = Math.floor((date - premierJanvier) / unJour);
    return Math.ceil((joursDepuisDebutAnnee + premierJanvier.getDay() + 1) / 7);
  };

  const getNomMois = (date) => {
    const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return mois[date.getMonth()];
  };

  const getNumeroMois = (nomMois) => {
    const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return mois.indexOf(nomMois);
  };

  const isMemeJour = (date1, date2) => {
    return date1.getDate() === date2.getDate() && 
           date1.getMonth() === date2.getMonth() && 
           date1.getFullYear() === date2.getFullYear();
  };

  const isMemeMois = (date1, date2) => {
    return date1.getMonth() === date2.getMonth() && 
           date1.getFullYear() === date2.getFullYear();
  };

  const isMemeTrimestre = (date1, date2) => {
    return Math.floor(date1.getMonth() / 3) === Math.floor(date2.getMonth() / 3) && 
           date1.getFullYear() === date2.getFullYear();
  };

  const data = {
    labels: ventesGroupees.map(v => v[0]),
    datasets: [{
      label: `Total des ventes (Ar) - par ${periode}`,
      data: ventesGroupees.map(v => v[1]),
      backgroundColor: [
        '#FF6B6B', '#4ECDC4', '#FFD93D', '#FF8C00', '#7C3AED',
        '#34D399', '#60A5FA', '#F472B6', '#A78BFA', '#10B981'
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
        position: 'right',
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
          label: ctx => `${ctx.raw.toFixed(2)} Ar`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `${value} Ar`,
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <div className="controls mb-4">
        <select 
          value={periode}
          onChange={(e) => setPeriode(e.target.value)}
          className="mr-4 p-2 border rounded"
        >
          <option value="jour">Par jour</option>
          <option value="semaine">Par semaine</option>
          <option value="mois">Par mois</option>
          <option value="trimestre">Par trimestre</option>
          <option value="annee">Par année</option>
        </select>

        {(periode === 'jour' || periode === 'mois' || periode === 'trimestre' || periode === 'annee') && (
          <input
            type="date"
            value={dateSpecifique}
            onChange={(e) => setDateSpecifique(e.target.value)}
            className="p-2 border rounded"
          />
        )}
      </div>
      
      <Bar data={data} options={options} />
    </div>
  );
}