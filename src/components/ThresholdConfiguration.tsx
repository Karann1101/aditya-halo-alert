
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Save, RotateCcw, Activity, Thermometer, Gauge, Zap, AlertTriangle } from 'lucide-react';

interface ThresholdConfig {
  parameter: string;
  label: string;
  icon: any;
  color: string;
  unit: string;
  enabled: boolean;
  value: number;
  range: [number, number];
  sensitivity: number;
}

const ThresholdConfiguration = () => {
  const [thresholds, setThresholds] = useState<ThresholdConfig[]>([
    {
      parameter: 'flux',
      label: 'Particle Flux',
      icon: Activity,
      color: '#06b6d4',
      unit: 'particles/cm²/s',
      enabled: true,
      value: 5000000,
      range: [1000000, 10000000],
      sensitivity: 75
    },
    {
      parameter: 'density',
      label: 'Number Density',
      icon: Gauge,
      color: '#8b5cf6',
      unit: 'cm⁻³',
      enabled: true,
      value: 25,
      range: [5, 100],
      sensitivity: 80
    },
    {
      parameter: 'temperature',
      label: 'Temperature',
      icon: Thermometer,
      color: '#f59e0b',
      unit: 'K',
      enabled: true,
      value: 500000,
      range: [100000, 1000000],
      sensitivity: 70
    },
    {
      parameter: 'velocity',
      label: 'Solar Wind Speed',
      icon: Zap,
      color: '#ef4444',
      unit: 'km/s',
      enabled: true,
      value: 800,
      range: [300, 2000],
      sensitivity: 85
    }
  ]);

  const [derivedParameters, setDerivedParameters] = useState({
    gradient_threshold: 0.15,
    moving_average_window: 30,
    combined_metric_weight: {
      flux: 0.3,
      density: 0.25,
      temperature: 0.2,
      velocity: 0.25
    }
  });

  const updateThreshold = (index: number, field: string, value: any) => {
    const newThresholds = [...thresholds];
    newThresholds[index] = { ...newThresholds[index], [field]: value };
    setThresholds(newThresholds);
  };

  const resetToDefaults = () => {
    // Reset to default values
    setThresholds(prev => prev.map(threshold => ({
      ...threshold,
      value: threshold.range[0] + (threshold.range[1] - threshold.range[0]) * 0.6,
      sensitivity: 75,
      enabled: true
    })));
  };

  const formatValue = (value: number, parameter: string) => {
    switch (parameter) {
      case 'flux':
        return `${(value / 1000000).toFixed(1)}M`;
      case 'temperature':
        return `${(value / 1000).toFixed(0)}K`;
      default:
        return value.toString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Overview */}
      <Card className="space-card glow-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-cosmic flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Threshold Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure detection thresholds for identifying Halo CME events
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                {thresholds.filter(t => t.enabled).length} Active
              </Badge>
              <Button variant="outline" size="sm" onClick={resetToDefaults} className="border-border/50">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button size="sm" className="bg-accent text-accent-foreground">
                <Save className="h-4 w-4 mr-2" />
                Save Config
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-md">
          <TabsTrigger value="basic">Basic Thresholds</TabsTrigger>
          <TabsTrigger value="derived">Derived Parameters</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {thresholds.map((threshold, index) => {
              const Icon = threshold.icon;
              return (
                <Card key={threshold.parameter} className="space-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5" style={{ color: threshold.color }} />
                        <CardTitle className="text-base">{threshold.label}</CardTitle>
                      </div>
                      <Switch
                        checked={threshold.enabled}
                        onCheckedChange={(enabled) => updateThreshold(index, 'enabled', enabled)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Threshold Value */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Threshold Value</Label>
                        <span className="text-sm font-bold" style={{ color: threshold.color }}>
                          {formatValue(threshold.value, threshold.parameter)} {threshold.unit}
                        </span>
                      </div>
                      <Slider
                        value={[threshold.value]}
                        onValueChange={(value) => updateThreshold(index, 'value', value[0])}
                        min={threshold.range[0]}
                        max={threshold.range[1]}
                        step={threshold.range[1] / 100}
                        className="w-full"
                        disabled={!threshold.enabled}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{formatValue(threshold.range[0], threshold.parameter)}</span>
                        <span>{formatValue(threshold.range[1], threshold.parameter)}</span>
                      </div>
                    </div>

                    {/* Sensitivity */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Detection Sensitivity</Label>
                        <span className="text-sm font-bold text-yellow-400">
                          {threshold.sensitivity}%
                        </span>
                      </div>
                      <Slider
                        value={[threshold.sensitivity]}
                        onValueChange={(value) => updateThreshold(index, 'sensitivity', value[0])}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                        disabled={!threshold.enabled}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Conservative</span>
                        <span>Aggressive</span>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <span className="text-sm">Status</span>
                      <Badge variant={threshold.enabled ? "default" : "secondary"}>
                        {threshold.enabled ? "Active" : "Disabled"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="derived" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gradient Analysis */}
            <Card className="space-card">
              <CardHeader>
                <CardTitle className="text-cosmic">Gradient Analysis</CardTitle>
                <CardDescription>
                  Configure parameters for detecting rapid changes in particle data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Gradient Threshold</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[derivedParameters.gradient_threshold]}
                      onValueChange={(value) => setDerivedParameters(prev => ({
                        ...prev,
                        gradient_threshold: value[0]
                      }))}
                      min={0.01}
                      max={0.5}
                      step={0.01}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={derivedParameters.gradient_threshold}
                      onChange={(e) => setDerivedParameters(prev => ({
                        ...prev,
                        gradient_threshold: parseFloat(e.target.value)
                      }))}
                      className="w-20 text-center bg-muted/20 border-border/50"
                      step={0.01}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Moving Average Window</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[derivedParameters.moving_average_window]}
                      onValueChange={(value) => setDerivedParameters(prev => ({
                        ...prev,
                        moving_average_window: value[0]
                      }))}
                      min={5}
                      max={120}
                      step={5}
                      className="flex-1"
                    />
                    <div className="w-20 text-center text-sm font-bold text-accent">
                      {derivedParameters.moving_average_window} min
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Combined Metric */}
            <Card className="space-card">
              <CardHeader>
                <CardTitle className="text-cosmic">Combined Metric Weights</CardTitle>
                <CardDescription>
                  Configure relative importance of each parameter in detection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(derivedParameters.combined_metric_weight).map(([param, weight]) => {
                  const threshold = thresholds.find(t => t.parameter === param);
                  if (!threshold) return null;
                  
                  const Icon = threshold.icon;
                  return (
                    <div key={param}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" style={{ color: threshold.color }} />
                          <Label className="text-sm font-medium">{threshold.label}</Label>
                        </div>
                        <span className="text-sm font-bold" style={{ color: threshold.color }}>
                          {Math.round(weight * 100)}%
                        </span>
                      </div>
                      <Slider
                        value={[weight]}
                        onValueChange={(value) => setDerivedParameters(prev => ({
                          ...prev,
                          combined_metric_weight: {
                            ...prev.combined_metric_weight,
                            [param]: value[0]
                          }
                        }))}
                        min={0}
                        max={1}
                        step={0.05}
                        className="w-full"
                      />
                    </div>
                  );
                })}
                
                <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Weight</span>
                    <span className="font-bold text-accent">
                      {Math.round(Object.values(derivedParameters.combined_metric_weight).reduce((a, b) => a + b, 0) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          <Card className="space-card">
            <CardHeader>
              <CardTitle className="text-cosmic">Threshold Validation</CardTitle>
              <CardDescription>
                Test current configuration against historical CME events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/50">
                  <div className="text-2xl font-bold text-green-400">92%</div>
                  <div className="text-sm text-muted-foreground">Detection Rate</div>
                </div>
                <div className="text-center p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/50">
                  <div className="text-2xl font-bold text-yellow-400">8%</div>
                  <div className="text-sm text-muted-foreground">False Positives</div>
                </div>
                <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/50">
                  <div className="text-2xl font-bold text-blue-400">156</div>
                  <div className="text-sm text-muted-foreground">Test Events</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm">Recommendation</span>
                  </div>
                  <span className="text-sm text-yellow-400">Increase flux sensitivity by 5%</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1 border-border/50">
                    Run Validation
                  </Button>
                  <Button variant="outline" className="flex-1 border-border/50">
                    Export Results
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThresholdConfiguration;
