import React, { useState } from 'react';
import { DocumentUpload } from '../components/knowledge-base/DocumentUpload';
import { SearchBar } from '../components/knowledge-base/SearchBar';
import { SearchResults } from '../components/knowledge-base/SearchResults';
import { ChatWithKnowledgeBase } from '../components/knowledge-base/ChatWithKnowledgeBase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function KnowledgeBase() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUploadSuccess = () => {
    // Optionally refresh search results or show a message
    console.log('Document uploaded successfully');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Knowledge Base</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>
                Add new documents to your knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentUpload onUploadSuccess={handleUploadSuccess} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Search Knowledge Base</CardTitle>
              <CardDescription>
                Find information across all your documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SearchBar onSearch={handleSearch} />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="search" className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Search Results</TabsTrigger>
              <TabsTrigger value="chat">Chat with AI</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="mt-6">
              <SearchResults results={searchResults} isLoading={isSearching} />
            </TabsContent>
            
            <TabsContent value="chat" className="mt-6 h-[600px]">
              <ChatWithKnowledgeBase />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
```

```typescript