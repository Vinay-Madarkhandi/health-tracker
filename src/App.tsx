import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Type Definitions
interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner';
  description: string;
}

interface DailyRecord {
  date: string;
  weight: number;
  meal: Meal;
}

const App: React.FC = () => {
  // State Hooks with Typescript Typing
  const [weight, setWeight] = useState<string>('');
  const [mealType, setMealType] = useState<Meal['type'] | ''>('');
  const [mealDescription, setMealDescription] = useState<string>('');
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);

  // Fetch Records on Component Mount
  useEffect(() => {
    fetchDailyRecords();
  }, []);

  // Fetch Daily Records
  const fetchDailyRecords = async (): Promise<void> => {
    try {
      const response = await axios.get<DailyRecord[]>('https://health-tracker-api-10qv.onrender.com/api/daily-records');
      setDailyRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Validate Inputs
    if (!weight || !mealType) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const recordData: DailyRecord = {
        date: new Date().toISOString(),
        weight: parseFloat(weight),
        meal: {
          type: mealType,
          description: mealDescription
        }
      };

      await axios.post('https://health-tracker-api-10qv.onrender.com/api/daily-record', recordData);
      
      // Reset Form and Refresh Records
      setWeight('');
      setMealType('');
      setMealDescription('');
      fetchDailyRecords();
    } catch (error) {
      console.error('Error submitting record:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Daily Health Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Weight (kg)</label>
              <Input 
                type="number" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter your weight"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Meal Type</label>
              <Select 
                value={mealType} 
                onValueChange={(value: Meal['type']) => setMealType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-2">Meal Description</label>
              <Input 
                type="text"
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value)}
                placeholder="Describe your meal"
              />
            </div>

            <Button type="submit" className="w-full">
              Record Daily Entry
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Recent Records</h2>
        {dailyRecords.map((record, index) => (
          <Card key={index} className="mb-2">
            <CardContent>
              <div>Date: {new Date(record.date).toLocaleDateString()}</div>
              <div>Weight: {record.weight} kg</div>
              <div>
                Meal: {record.meal.type} - {record.meal.description}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default App;