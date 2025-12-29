import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { mes: 'Ene', ventas: 4000, cobranza: 3800 },
  { mes: 'Feb', ventas: 3000, cobranza: 2800 },
  { mes: 'Mar', ventas: 5000, cobranza: 4700 },
  { mes: 'Abr', ventas: 4500, cobranza: 4200 },
  { mes: 'May', ventas: 6000, cobranza: 5500 },
  { mes: 'Jun', ventas: 5500, cobranza: 5200 },
  { mes: 'Jul', ventas: 7000, cobranza: 6500 },
];

export function SalesChart() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 animate-slide-up">
      <div className="mb-6">
        <h3 className="text-lg font-display font-semibold text-foreground">Ventas vs Cobranza</h3>
        <p className="text-sm text-muted-foreground">Comparativo mensual del año</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(50, 100%, 50%)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(50, 100%, 50%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCobranza" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 85%, 55%)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(0, 85%, 55%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
            <XAxis 
              dataKey="mes" 
              stroke="hsl(0, 0%, 45%)"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(0, 0%, 45%)"
              fontSize={12}
              tickFormatter={(value) => `$${value/1000}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(0, 0%, 90%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
            />
            <Area 
              type="monotone" 
              dataKey="ventas" 
              stroke="hsl(50, 100%, 50%)" 
              fillOpacity={1} 
              fill="url(#colorVentas)"
              strokeWidth={2}
              name="Ventas"
            />
            <Area 
              type="monotone" 
              dataKey="cobranza" 
              stroke="hsl(0, 85%, 55%)" 
              fillOpacity={1} 
              fill="url(#colorCobranza)"
              strokeWidth={2}
              name="Cobranza"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Ventas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-sm text-muted-foreground">Cobranza</span>
        </div>
      </div>
    </div>
  );
}
