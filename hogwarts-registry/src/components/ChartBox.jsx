// Concept 07: one reusable Chart.js component.
// The chart is created once; when the data changes we update the same chart.
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
Chart.defaults.color =
  getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#444';
Chart.defaults.borderColor = 'rgba(128,128,128,.25)';

export default function ChartBox({ type, labels, datasets, height = 240 }) {
  const ref = useRef();
  const chart = useRef();
  const key = JSON.stringify([labels, datasets.map((d) => [d.label, d.data, d.backgroundColor])]);

  useEffect(() => {
    chart.current = new Chart(ref.current, {
      type,
      data: { labels, datasets: datasets.map((d) => ({ ...d })) },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: datasets.length > 1 || type === 'doughnut' } },
      },
    });
    return () => chart.current.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const c = chart.current;
    if (!c) return;
    c.data.labels = labels;
    c.data.datasets.forEach((d, i) => {
      d.data = datasets[i].data;
      d.label = datasets[i].label;
      d.backgroundColor = datasets[i].backgroundColor;
    });
    c.update(); // refresh the existing chart instead of creating a new one
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <div style={{ height, position: 'relative' }}>
      <canvas ref={ref} />
    </div>
  );
}
