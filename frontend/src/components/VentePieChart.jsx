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
                '#FF6B6B', '#4ECDC4', '#FFD93D', '#FF8C00', '#7C3AED',
                '#34D399', '#60A5FA', '#F472B6', '#A78BFA', '#10B981'
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
    maintainAspectRatio: false, // Important pour que la div fixe la hauteur
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
      },
    },
  };

  return (
    <div className="chart-container">
      {loading ? (
        <p>Chargement du graphique... ⏳</p>
      ) : dataPie ? (
        <Pie data={dataPie} options={options} />
      ) : (
        <p>Impossible de charger les données. 😔</p>
      )}
    </div>
  );
}
