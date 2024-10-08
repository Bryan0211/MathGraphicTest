const { useState, useEffect } = React;
const { Line } = ReactChartjs2;

// Utility functions
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
        maintainAspectRatio: false,
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
        <div className="formula-card">
            <h2 className="text-xl font-bold mb-2">{formula}</h2>
            <p className="mb-4">Period: {calculatePeriod(formula, a, b)}π</p>
            <div className="chart-container">
                {chartData && <Line data={chartData} options={options} />}
            </div>
        </div>
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
                    className="input-field"
                />
                <label className="mr-2">b: </label>
                <input
                    type="number"
                    value={b}
                    onChange={(e) => setB(Number(e.target.value))}
                    className="input-field"
                />
            </div>
            {formulas.map((formula, index) => (
                <FormulaCard key={index} formula={formula} a={a} b={b} />
            ))}
        </div>
    );
};

ReactDOM.render(<PeriodCalculator />, document.getElementById('root'));
