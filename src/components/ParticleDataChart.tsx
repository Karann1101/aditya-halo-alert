
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Thermometer, Gauge, Zap, Download, RefreshCw } from 'lucide-react';

// Mock data for SWIS Level-2 parameters
const generateMockData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < 144; i++) { // 24 hours of 10-minute intervals
    const time = new Date(now.getTime() - (143 - i) * 10 * 60 * 1000);
    data.push({
      timestamp: time.toISOString(),
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      flux: 1000000 + Math.random() * 2000000 + (i > 100 && i < 120 ? Math.random() * 5000000 : 0), // CME signature
      density: 5 + Math.random() * 10 + (i > 100 && i < 120 ? Math.random() * 30 : 0),
      temperature: 100000 + Math.random() * 200000 + (i > 100 && i < 120 ? Math.random() * 500000 : 0),
      velocity: 400 + Math.random() * 200 + (i > 100 && i < 120 ? Math.random() * 800 : 0),
    });
  }
  return data;
};

const ParticleDataChart = () => {
  const [data] = useState(generateMockData());
  const [activeParameter, setActiveParameter] = useState('flux');
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const formatValue = (value: number, parameter: string) => {
    switch (parameter) {
      case 'flux':
        return `${(value / 1000000).toFixed(2)}M`;
      case 'density':
        return `${value.toFixed(1)} cm⁻³`;
      case 'temperature':
        return `${(value / 1000).toFixed(0)}K`;
      case 'velocity':
        return `${value.toFixed(0)} km/s`;
      default:
        return value.toString();
    }
  };

  const getParameterConfig = (param: string) => {
    const configs = {
      flux: { color: '#06b6d4', icon: Activity, unit: 'particles/cm²/s', label: 'Particle Flux' },
      density: { color: '#8b5cf6', icon: Gauge, unit: 'cm⁻³', label: 'Number Density' },
      temperature: { color: '#f59e0b', icon: Thermometer, unit: 'K', label: 'Temperature' },
      velocity: { color: '#ef4444', icon: Zap, unit: 'km/s', label: 'Solar Wind Speed' },
    };
    return configs[param as keyof typeof configs];
  };

  return (
    <div className="space-y-6">
      {/* Parameter Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['flux', 'density', 'temperature', 'velocity'].map((param) => {
          const config = getParameterConfig(param);
          const Icon = config.icon;
          const currentValue = data[data.length - 1][param as keyof typeof data[0]];
          
          return (
            <Card 
              key={param}
              className={`space-card cursor-pointer transition-all duration-300 ${
                activeParameter === param ? 'ring-2 ring-accent glow-effect' : 'hover:glow-effect'
              }`}
              onClick={() => setActiveParameter(param)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{config.label}</CardTitle>
                <Icon className="h-4 w-4" style={{ color: config.color }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: config.color }}>
                  {formatValue(currentValue as number, param)}
                </div>
                <p className="text-xs text-muted-foreground">{config.unit}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Chart */}
      <Card className="space-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-cosmic">
                SWIS Level-2 Data - {getParameterConfig(activeParameter).label}
              </CardTitle>
              <CardDescription>
                Real-time particle measurements from Aditya-L1 (Last 24 hours)
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Live Data
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isLoading}
                className="border-border/50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="border-border/50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`gradient-${activeParameter}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getParameterConfig(activeParameter).color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={getParameterConfig(activeParameter).color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatValue(value, activeParameter)}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    backdropFilter: 'blur(8px)',
                  }}
                  formatter={(value: number) => [formatValue(value, activeParameter), getParameterConfig(activeParameter).label]}
                />
                <Area
                  type="monotone"
                  dataKey={activeParameter}
                  stroke={getParameterConfig(activeParameter).color}
                  strokeWidth={2}
                  fill={`url(#gradient-${activeParameter})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Multi-parameter Overview */}
      <Card className="space-card">
        <CardHeader>
          <CardTitle className="text-cosmic">Multi-Parameter Overview</CardTitle>
          <CardDescription>
            Normalized view of all SWIS parameters for correlation analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  domain={['dataMin', 'dataMax']}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    backdropFilter: 'blur(8px)',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="flux" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  dot={false}
                  name="Particle Flux"
                />
                <Line 
                  type="monotone" 
                  dataKey="density" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={false}
                  name="Density"
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={false}
                  name="Temperature"
                />
                <Line 
                  type="monotone" 
                  dataKey="velocity" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={false}
                  name="Velocity"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParticleDataChart;
