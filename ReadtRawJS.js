import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const lcm = (a, b) => {
  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  return (a * b) / gcd(a, b);
};

const calculatePeriod = (formula, a, b) => {
  if (a === 0 || b === 0) return 'Undefined';
  const absA = Math.abs(a);
  const absB = Math.abs(b);
  
  switch(formula) {
    case 'sin(ax)':
    case 'cos(ax)':
      return 2 / absA;
    case 'tan(ax)':
    case '|sin(ax)|':
    case '|cos(ax)|':
    case '|tan(ax)|':
      return 1 / absA;
    case 'sin(ax) ± cos(bx)':
    case 'sin(ax) ± tan(bx)':
    case 'cos(ax) ± tan(bx)':
      return a === b ? 2 / absA : 2 / lcm(absA, absB);
    case '|sin(ax)| ± cos(bx)':
    case 'sin(ax) ± |cos(bx)|':
    case '|sin(ax)| ± tan(bx)':
    case 'sin(ax) ± |tan(bx)|':
    case '|cos(ax)| ± tan(bx)':
    case 'cos(ax) ± |tan(bx)|':
    case '|sin(ax) ± cos(bx)|':
    case '|sin(ax) ± tan(bx)|':
    case '|cos(ax) ± tan(bx)|':
      return 2 / lcm(absA, absB);
    case '|sin(ax)| ± |cos(bx)|':
    case '|sin(ax)| ± |tan(bx)|':
    case '|cos(ax)| ± |tan(bx)|':
      return 1 / lcm(absA, absB);
    default:
      return 'Unknown formula';
  }
};

const generatePoints = (formula, a, b) => {
  const points = [];
  const step = 0.1;
  for (let x = 0; x <= 4 * Math.PI; x += step) {
    let y;
    switch (formula) {
      case 'sin(ax)':
        y = Math.sin(a * x);
        break;
      case 'cos(ax)':
        y = Math.cos(a * x);
        break;
      case 'tan(ax)':
        y = Math.tan(a * x);
        break;
      case '|sin(ax)|':
        y = Math.abs(Math.sin(a * x));
        break;
      case '|cos(ax)|':
        y = Math.abs(Math.cos(a * x));
        break;
      case '|tan(ax)|':
        y = Math.abs(Math.tan(a * x));
        break;
      case 'sin(ax) ± cos(bx)':
        y = Math.sin(a * x) + Math.cos(b * x);
        break;
      case 'sin(ax) ± tan(bx)':
        y = Math.sin(a * x) + Math.tan(b * x);
        break;
      case 'cos(ax) ± tan(bx)':
        y = Math.cos(a * x) + Math.tan(b * x);
        break;
      case '|sin(ax)| ± cos(bx)':
        y = Math.abs(Math.sin(a * x)) + Math.cos(b * x);
        break;
      case 'sin(ax) ± |cos(bx)|':
        y = Math.sin(a * x) + Math.abs(Math.cos(b * x));
        break;
      case '|sin(ax)| ± tan(bx)':
        y = Math.abs(Math.sin(a * x)) + Math.tan(b * x);
        break;
      case 'sin(ax) ± |tan(bx)|':
        y = Math.sin(a * x) + Math.abs(Math.tan(b * x));
        break;
      case '|cos(ax)| ± tan(bx)':
        y = Math.abs(Math.cos(a * x)) + Math.tan(b * x);
        break;
      case 'cos(ax) ± |tan(bx)|':
        y = Math.cos(a * x) + Math.abs(Math.tan(b * x));
        break;
      case '|sin(ax)| ± |cos(bx)|':
        y = Math.abs(Math.sin(a * x)) + Math.abs(Math.cos(b * x));
        break;
      case '|sin(ax)| ± |tan(bx)|':
        y = Math.abs(Math.sin(a * x)) + Math.abs(Math.tan(b * x));
        break;
      case '|cos(ax)| ± |tan(bx)|':
        y = Math.abs(Math.cos(a * x)) + Math.abs(Math.tan(b * x));
        break;
      case '|sin(ax) ± cos(bx)|':
        y = Math.abs(Math.sin(a * x) + Math.cos(b * x));
        break;
      case '|sin(ax) ± tan(bx)|':
        y = Math.abs(Math.sin(a * x) + Math.tan(b * x));
        break;
      case '|cos(ax) ± tan(bx)|':
        y = Math.abs(Math.cos(a * x) + Math.tan(b * x));
        break;
      default:
        y = 0;
    }
    if (!isNaN(y) && isFinite(y)) {
      points.push({ x, y });
    }
  }
  return points;
};

const formulas = [
  'sin(ax)', 'cos(ax)', 'tan(ax)',
  '|sin(ax)|', '|cos(ax)|', '|tan(ax)|',
  'sin(ax) ± cos(bx)', 'sin(ax) ± tan(bx)', 'cos(ax) ± tan(bx)',
  '|sin(ax)| ± cos(bx)', 'sin(ax) ± |cos(bx)|',
  '|sin(ax)| ± tan(bx)', 'sin(ax) ± |tan(bx)|',
  '|cos(ax)| ± tan(bx)', 'cos(ax) ± |tan(bx)|',
  '|sin(ax)| ± |cos(bx)|', '|sin(ax)| ± |tan(bx)|', '|cos(ax)| ± |tan(bx)|',
  '|sin(ax) ± cos(bx)|', '|sin(ax) ± tan(bx)|', '|cos(ax) ± tan(bx)|'
];

const FormulaCard = ({ formula, a, b }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const points = generatePoints(formula, a, b);
    setChartData({
      labels: points.map(p => p.x),
      datasets: [
        {
          label: formula,
          data: points,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    });
  }, [formula, a, b]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: formula,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'x (π units)',
        },
        ticks: {
          callback: function(value) {
            return (value / Math.PI).toFixed(1) + 'π';
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'y',
        }
      }
    }
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>{formula}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Period: {calculatePeriod(formula, a, b)}π</p>
        {chartData && <Line data={chartData} options={options} />}
      </CardContent>
    </Card>
  );
};

const PeriodCalculator = () => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">三角函數週期計算器與圖形繪製</h1>
      <div className="mb-4">
        <label className="mr-2">a: </label>
        <input
          type="number"
          value={a}
          onChange={(e) => setA(Number(e.target.value))}
          className="border p-1 mr-4"
        />
        <label className="mr-2">b: </label>
        <input
          type="number"
          value={b}
          onChange={(e) => setB(Number(e.target.value))}
          className="border p-1"
        />
      </div>
      {formulas.map((formula, index) => (
        <FormulaCard key={index} formula={formula} a={a} b={b} />
      ))}
    </div>
  );
};

export default PeriodCalculator;
