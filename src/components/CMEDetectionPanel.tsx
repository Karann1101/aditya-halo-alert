
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, XCircle, Search, Filter, Calendar, Clock } from 'lucide-react';

// Mock CME event data
const mockCMEEvents = [
  {
    id: '001',
    timestamp: '2024-12-25T14:30:00Z',
    type: 'Full Halo',
    magnitude: 'X2.1',
    speed: 1200,
    confidence: 0.95,
    status: 'confirmed',
    source: 'CACTUS',
    parameters: {
      flux_peak: 8500000,
      density_peak: 45.2,
      temp_peak: 850000,
      velocity_peak: 1200
    }
  },
  {
    id: '002',
    timestamp: '2024-12-23T09:15:00Z',
    type: 'Partial Halo',
    magnitude: 'M8.4',
    speed: 950,
    confidence: 0.87,
    status: 'pending',
    source: 'SWIS',
    parameters: {
      flux_peak: 6200000,
      density_peak: 32.1,
      temp_peak: 620000,
      velocity_peak: 950
    }
  },
  {
    id: '003',
    timestamp: '2024-12-20T16:45:00Z',
    type: 'Full Halo',
    magnitude: 'M5.2',
    speed: 750,
    confidence: 0.92,
    status: 'confirmed',
    source: 'CACTUS',
    parameters: {
      flux_peak: 4800000,
      density_peak: 28.7,
      temp_peak: 480000,
      velocity_peak: 750
    }
  }
];

const CMEDetectionPanel = () => {
  const [events, setEvents] = useState(mockCMEEvents);
  const [selectedEvent, setSelectedEvent] = useState(mockCMEEvents[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.magnitude.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Detection Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="space-card glow-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cosmic">{events.length}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="space-card glow-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {events.filter(e => e.status === 'confirmed').length}
            </div>
            <p className="text-xs text-muted-foreground">95% accuracy</p>
          </CardContent>
        </Card>

        <Card className="space-card glow-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <CheckCircle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {Math.round(events.reduce((acc, e) => acc + e.confidence, 0) / events.length * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Detection accuracy</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event List */}
        <Card className="space-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-cosmic">CME Event Detection</CardTitle>
                <CardDescription>Halo CME events identified from SWIS data</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-border/50">
                <Filter className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
            {/* Search and Filter */}
            <div className="flex space-x-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-muted/20 border-border/50"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-muted/20 border border-border/50 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredEvents.map((event) => {
                const timestamp = formatTimestamp(event.timestamp);
                return (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedEvent.id === event.id
                        ? 'border-accent bg-accent/10 glow-effect'
                        : 'border-border/50 bg-muted/10 hover:bg-muted/20'
                    }`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(event.status)}
                        <span className="font-semibold text-sm">Event {event.id}</span>
                        <Badge variant="outline" className="text-xs">
                          {event.source}
                        </Badge>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <div>{timestamp.date}</div>
                        <div>{timestamp.time}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-solar">{event.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.magnitude} • {event.speed} km/s
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${getConfidenceColor(event.confidence)}`}>
                          {Math.round(event.confidence * 100)}%
                        </p>
                        <p className="text-xs text-muted-foreground">confidence</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Event Details */}
        <Card className="space-card">
          <CardHeader>
            <CardTitle className="text-cosmic">Event Details</CardTitle>
            <CardDescription>
              Detailed analysis of Event {selectedEvent.id}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Event Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Event ID</Label>
                <p className="font-semibold">{selectedEvent.id}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Type</Label>
                <p className="font-semibold text-solar">{selectedEvent.type}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Magnitude</Label>
                <p className="font-semibold text-destructive">{selectedEvent.magnitude}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Speed</Label>
                <p className="font-semibold">{selectedEvent.speed} km/s</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Confidence</Label>
                <p className={`font-semibold ${getConfidenceColor(selectedEvent.confidence)}`}>
                  {Math.round(selectedEvent.confidence * 100)}%
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedEvent.status)}
                  <span className="font-semibold capitalize">{selectedEvent.status}</span>
                </div>
              </div>
            </div>

            {/* Parameter Analysis */}
            <div>
              <Label className="text-muted-foreground text-base font-semibold">Peak Parameters</Label>
              <div className="mt-3 space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                  <span className="text-sm">Particle Flux</span>
                  <span className="font-semibold text-cyan-400">
                    {(selectedEvent.parameters.flux_peak / 1000000).toFixed(2)}M particles/cm²/s
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                  <span className="text-sm">Number Density</span>
                  <span className="font-semibold text-purple-400">
                    {selectedEvent.parameters.density_peak.toFixed(1)} cm⁻³
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                  <span className="text-sm">Temperature</span>
                  <span className="font-semibold text-yellow-400">
                    {(selectedEvent.parameters.temp_peak / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                  <span className="text-sm">Velocity</span>
                  <span className="font-semibold text-red-400">
                    {selectedEvent.parameters.velocity_peak} km/s
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1 border-border/50">
                View Raw Data
              </Button>
              <Button variant="outline" className="flex-1 border-border/50">
                Export Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CMEDetectionPanel;
