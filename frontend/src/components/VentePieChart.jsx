import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function VentePieChart() {
  const [dataPie, setDataPie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenteDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/produits/vente-details/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données');
        }

        const details = await response.json();
        const aggregation = {};
        details.forEach((item) => {
          const nom = item.produit.nom_produit;
          aggregation[nom] = (aggregation[nom] || 0) + item.quantite;
        });

        const labels = Object.keys(aggregation);
        const valeurs = Object.values(aggregation);

        setDataPie({
          labels,
          datasets: [
            {
              label: 'Quantité vendue',
              data: valeurs,
              backgroundColor: [
                '#FF6B6B', // Rouge vibrant 🍒
                '#4ECDC4', // Turquoise frais 🌊
                '#FFD93D', // Jaune éclatant 🌞
                '#FF8C00', // Orange dynamique 🔥
                '#7C3AED', // Violet audacieux 💜
              ],
              borderColor: '#FFFFFF',
              borderWidth: 2,
            },
          ],
        });
        setLoading(false);
      } catch (err) {
        console.error('Erreur de chargement du camembert :', err);
        setLoading(false);
      }
    };

    fetchVenteDetails();
  }, []);

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
      },
    },
  };

  return (
    <>
      {loading ? (
        <p>Chargement du graphique... ⏳</p>
      ) : dataPie ? (
        <Pie data={dataPie} options={options} />
      ) : (
        <p>Impossible de charger les données. 😔</p>
      )}
    </>
  );
}