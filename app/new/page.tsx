"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

export default function NewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [options, setOptions] = useState([
    { name: '', id: 1 },
    { name: '', id: 2 },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !endDate || options.length < 2 || options.length > 5) {
      toast({
        title: "Invalid Proposal",
        description: "Please fill in all required fields and provide at least two options.",
        variant: "destructive",
      });
      return;
    }
    try {
      // POST to the API endpoint. Make sure the endpoint path matches your API route.
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Convert options to an array of strings
        body: JSON.stringify({
          title,
          options: options.map((option) => option.name),
          endDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error creating proposal",
          description: data.error || "An error occurred.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Proposal Created",
        description:
          "Your governance proposal has been submitted successfully.",
      });
      router.push('/');
    } catch (error) {
      console.error("Error submitting proposal: ", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const addOption = () => {
    if (options.length >= 10) {
      toast({
        title: "Cannot have more than 5 options",
        description: "A proposal must have maximum 5 options.",
        variant: "destructive",
      });
      return;

    }
    setOptions([...options, { name: '', id: Date.now() }]);
  };

  const removeOption = (id: number) => {
    if (options.length <= 2) {
      toast({
        title: "Cannot Remove Option",
        description: "A proposal must have at least two options.",
        variant: "destructive",
      });
      return;
    }
    setOptions(options.filter(option => option.id !== id));
  };

  const updateOption = (id: number, name: string) => {
    setOptions(options.map(option =>
      option.id === id ? { ...option, name } : option
    ));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Proposals
        </Link>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Proposal</CardTitle>
            <CardDescription>
              Submit a new proposal for the Ethereum community to vote on
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Proposal</Label>
                <Input
                  id="title"
                  placeholder="Enter the title of your proposal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Voting Options</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </div>

                <div className="space-y-3">
                  {options.map((option) => (
                    <div key={option.id} className="flex gap-2">
                      <Input
                        placeholder="Option name"
                        value={option.name}
                        onChange={(e) => updateOption(option.id, e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(option.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                Create Proposal
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

