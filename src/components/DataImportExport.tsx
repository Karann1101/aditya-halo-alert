
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Download, Upload, FileText, Calendar, Globe, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const DataImportExport = () => {
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [dataSource, setDataSource] = useState('issdc');

  const handleImport = () => {
    setIsImporting(true);
    setImportProgress(0);
    
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsImporting(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const dataConnections = [
    {
      id: 'issdc',
      name: 'ISSDC (ISRO)',
      description: 'Indian Space Science Data Centre',
      status: 'connected',
      lastSync: '2024-12-28 14:30:00',
      dataTypes: ['SWIS Level-2', 'Particle Flux', 'Solar Wind Parameters'],
      icon: Database
    },
    {
      id: 'cactus',
      name: 'CACTUS CME Database',
      description: 'Computer Aided CME Tracking',
      status: 'connected',
      lastSync: '2024-12-28 12:15:00',  
      dataTypes: ['CME Events', 'Halo CME Catalog', 'Event Properties'],
      icon: Globe
    },
    {
      id: 'nasa_spdf',
      name: 'NASA SPDF',
      description: 'Space Physics Data Facility',
      status: 'pending',
      lastSync: 'Never',
      dataTypes: ['CDF Files', 'Solar Wind Data', 'Magnetic Field'],
      icon: Database
    }
  ];

  const recentImports = [
    {
      id: '001',
      source: 'ISSDC',
      type: 'SWIS Level-2 Data',
      date: '2024-12-28',
      size: '2.4 GB',
      records: '144,000',
      status: 'completed'
    },
    {
      id: '002',
      source: 'CACTUS',
      type: 'CME Event Catalog',
      date: '2024-12-27',
      size: '8.2 MB',
      records: '1,256',
      status: 'completed'
    },
    {
      id: '003',
      source: 'ISSDC',
      type: 'Particle Flux Data',
      date: '2024-12-26',
      size: '1.8 GB',
      records: '96,000',
      status: 'processing'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending':
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Database className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending':
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Sources Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="space-card glow-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Sources</CardTitle>
            <Database className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {dataConnections.filter(d => d.status === 'connected').length}
            </div>
            <p className="text-xs text-muted-foreground">Active connections</p>
          </CardContent>
        </Card>

        <Card className="space-card glow-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Volume</CardTitle>
            <FileText className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cosmic">47.2 GB</div>
            <p className="text-xs text-muted-foreground">Total imported</p>
          </CardContent>
        </Card>

        <Card className="space-card glow-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">2h ago</div>
            <p className="text-xs text-muted-foreground">Auto-sync enabled</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sources" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-md">
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export & Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dataConnections.map((connection) => {
              const Icon = connection.icon;
              return (
                <Card key={connection.id} className="space-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-6 w-6 text-cosmic" />
                        <div>
                          <CardTitle className="text-base">{connection.name}</CardTitle>
                          <CardDescription>{connection.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(connection.status)}>
                        {getStatusIcon(connection.status)}
                        <span className="ml-1 capitalize">{connection.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Data Types</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {connection.dataTypes.map((type, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Last Sync</Label>
                      <p className="text-sm font-mono">{connection.lastSync}</p>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-border/50"
                        disabled={connection.status !== 'connected'}
                      >
                        Configure
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-border/50"
                        disabled={connection.status !== 'connected'}
                      >
                        Sync Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Import Configuration */}
            <Card className="space-card">
              <CardHeader>
                <CardTitle className="text-cosmic">Import SWIS Data</CardTitle>
                <CardDescription>
                  Import Level-2 data from ISSDC or upload local files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Data Source</Label>
                  <select 
                    value={dataSource}
                    onChange={(e) => setDataSource(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-muted/20 border border-border/50 rounded-md text-sm"
                  >
                    <option value="issdc">ISSDC (ISRO)</option>
                    <option value="cactus">CACTUS CME Database</option>
                    <option value="local">Local Files (CDF)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Start Date</Label>
                    <Input 
                      type="date" 
                      defaultValue="2024-08-01"
                      className="mt-1 bg-muted/20 border-border/50"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">End Date</Label>
                    <Input 
                      type="date" 
                      defaultValue="2024-12-28"
                      className="mt-1 bg-muted/20 border-border/50"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Parameters</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['Particle Flux', 'Number Density', 'Temperature', 'Velocity'].map((param) => (
                      <label key={param} className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>{param}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {isImporting && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Import Progress</Label>
                      <span className="text-sm text-accent">{importProgress}%</span>
                    </div>
                    <Progress value={importProgress} className="w-full" />
                  </div>
                )}

                <Button 
                  onClick={handleImport} 
                  disabled={isImporting}
                  className="w-full bg-accent text-accent-foreground"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isImporting ? 'Importing...' : 'Start Import'}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Imports */}
            <Card className="space-card">
              <CardHeader>
                <CardTitle className="text-cosmic">Recent Imports</CardTitle>
                <CardDescription>
                  History of data imports and processing status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentImports.map((importItem) => (
                    <div key={importItem.id} className="p-3 bg-muted/20 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(importItem.status)}
                          <span className="font-semibold text-sm">{importItem.source}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{importItem.date}</span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-1">{importItem.type}</div>
                      
                      <div className="flex justify-between text-xs">
                        <span>{importItem.size}</span>
                        <span>{importItem.records} records</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Export Options */}
            <Card className="space-card">
              <CardHeader>
                <CardTitle className="text-cosmic">Export Data</CardTitle>
                <CardDescription>
                  Export processed data and analysis results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Export Type</Label>
                  <select className="w-full mt-1 px-3 py-2 bg-muted/20 border border-border/50 rounded-md text-sm">
                    <option>CME Detection Results</option>
                    <option>Threshold Analysis</option>
                    <option>Raw SWIS Data</option>
                    <option>Statistical Summary</option>
                  </select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Format</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {['CSV', 'JSON', 'CDF'].map((format) => (
                      <label key={format} className="flex items-center space-x-2 text-sm">
                        <input type="radio" name="format" defaultChecked={format === 'CSV'} />
                        <span>{format}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Date Range</Label>
                    <Input 
                      type="date" 
                      defaultValue="2024-12-01"
                      className="mt-1 bg-muted/20 border-border/50"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">To</Label>
                    <Input 
                      type="date" 
                      defaultValue="2024-12-28"
                      className="mt-1 bg-muted/20 border-border/50"
                    />
                  </div>
                </div>

                <Button className="w-full bg-accent text-accent-foreground">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Export
                </Button>
              </CardContent>
            </Card>

            {/* Reports */}
            <Card className="space-card">
              <CardHeader>
                <CardTitle className="text-cosmic">Analysis Reports</CardTitle>
                <CardDescription>
                  Generate comprehensive analysis reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { title: 'Monthly CME Summary', desc: 'December 2024 analysis', size: '2.4 MB' },
                    { title: 'Threshold Validation Report', desc: 'Current configuration analysis', size: '1.8 MB' },
                    { title: 'SWIS Data Quality Report', desc: 'Coverage and accuracy metrics', size: '956 KB' }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div>
                        <div className="font-semibold text-sm">{report.title}</div>
                        <div className="text-xs text-muted-foreground">{report.desc}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">{report.size}</div>
                        <Button variant="outline" size="sm" className="mt-1 border-border/50">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataImportExport;
