import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function VentePieChart1() {
  const [dataPie, setDataPie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [venteDetails, setVenteDetails] = useState([]);
  const [periode, setPeriode] = useState('tout');
  const [dateSpecifique, setDateSpecifique] = useState(new Date().toISOString().split('T')[0]);

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
        setVenteDetails(details);
        filtrerEtAgreger(details, periode, dateSpecifique);
      } catch (err) {
        console.error('Erreur de chargement du camembert :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenteDetails();
  }, [periode, dateSpecifique]);

  const filtrerEtAgreger = (details, groupBy, specificDate) => {
    const dateSpec = new Date(specificDate);
    const filtered = details.filter(item => {
      if (!item.vente?.date) return false;
      const dateVente = new Date(item.vente.date);
      switch (groupBy) {
        case 'jour': return isMemeJour(dateVente, dateSpec);
        case 'semaine': return isMemeSemaine(dateVente, dateSpec);
        case 'mois': return isMemeMois(dateVente, dateSpec);
        case 'trimestre': return isMemeTrimestre(dateVente, dateSpec);
        case 'annee': return dateVente.getFullYear() === dateSpec.getFullYear();
        default: return true;
      }
    });

    const aggregation = {};
    filtered.forEach(item => {
      if (!item.produit?.nom_produit) return;
      const nom = item.produit.nom_produit;
      aggregation[nom] = (aggregation[nom] || 0) + (item.quantite || 0);
    });

    const labels = Object.keys(aggregation);
    const valeurs = Object.values(aggregation);

    setDataPie({
      labels,
      datasets: [{
        label: 'Quantité vendue',
        data: valeurs,
        backgroundColor: [
          '#FF6B6B', '#4ECDC4', '#FFD93D', '#FF8C00', '#7C3AED',
          '#34D399', '#60A5FA', '#F472B6', '#A78BFA', '#10B981'
        ].slice(0, labels.length),
        borderColor: '#FFFFFF',
        borderWidth: 2,
      }],
    });
  };

  // Utilitaires de comparaison de dates
  const isMemeJour = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isMemeSemaine = (d1, d2) => {
    const week = date => {
      const temp = new Date(date);
      temp.setHours(0, 0, 0, 0);
      temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
      const first = new Date(temp.getFullYear(), 0, 4);
      return 1 + Math.round(((temp - first) / 86400000 - 3 + ((first.getDay() + 6) % 7)) / 7);
    };
    return d1.getFullYear() === d2.getFullYear() && week(d1) === week(d2);
  };

  const isMemeMois = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth();

  const isMemeTrimestre = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    Math.floor(d1.getMonth() / 3) === Math.floor(d2.getMonth() / 3);

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
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: '400px', position: 'relative' }}>
      <div style={{ marginBottom: '20px' }}>
        <select
          value={periode}
          onChange={(e) => setPeriode(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        >
          <option value="tout">Toutes périodes</option>
          <option value="jour">Jour</option>
          <option value="semaine">Semaine</option>
          <option value="mois">Mois</option>
          <option value="trimestre">Trimestre</option>
          <option value="annee">Année</option>
        </select>

        {periode !== 'tout' && (
          <input
            type="date"
            value={dateSpecifique}
            onChange={(e) => setDateSpecifique(e.target.value)}
            style={{ padding: '5px' }}
          />
        )}
      </div>

      {loading ? (
        <p>Chargement du graphique... ⏳</p>
      ) : dataPie && dataPie.labels.length > 0 ? (
        <Pie data={dataPie} options={options} />
      ) : (
        <p>Aucune donnée disponible pour cette période. 📭</p>
      )}
    </div>
  );
}
