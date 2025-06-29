import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent } from './ui/card';
import { Send, Bot, User } from 'lucide-react';

// Comprehensive CUDA response generator
const getCudaResponse = (input) => {
  const inputLower = input.toLowerCase();
  
  // Specific CUDA topic responses
  if (inputLower.includes('what is cuda') || inputLower.includes('define cuda')) {
    return `CUDA (Compute Unified Device Architecture) is NVIDIA's parallel computing platform and programming model. It allows developers to harness the power of GPUs for general-purpose computing, not just graphics. CUDA extends C/C++ with special syntax to define kernels - functions that run in parallel on hundreds or thousands of GPU cores simultaneously.`;
  }
  
  if (inputLower.includes('gpu') && inputLower.includes('cpu')) {
    return `Great question! CPUs are optimized for latency (fast single-threaded performance) with few cores (4-16), while GPUs are optimized for throughput with thousands of smaller cores. CPUs excel at complex branching and sequential tasks, while GPUs shine at parallel operations like vector math, image processing, and machine learning computations.`;
  }
  
  if (inputLower.includes('kernel')) {
    return `CUDA kernels are functions that execute on the GPU. They're defined with the __global__ qualifier and launched from host code. When you launch a kernel, you specify how many thread blocks and threads per block to use. Each thread executes the same kernel code but with different data - this is called SIMT (Single Instruction, Multiple Thread) execution.`;
  }
  
  if (inputLower.includes('memory') || inputLower.includes('global memory')) {
    return `GPU memory hierarchy is crucial for performance! Global memory is the largest but slowest (400-600 cycles latency). Shared memory is much faster (1-2 cycles) but limited per block. Constant memory is cached and great for read-only data. Registers are fastest but very limited. The key is to minimize global memory access and maximize memory coalescing.`;
  }
  
  if (inputLower.includes('thread') || inputLower.includes('block')) {
    return `CUDA organizes threads hierarchically: threads are grouped into blocks, and blocks form a grid. Threads in the same block can share data via shared memory and synchronize with __syncthreads(). Your thread ID is calculated as blockIdx.x * blockDim.x + threadIdx.x for 1D grids. This hierarchy matches GPU hardware architecture!`;
  }
  
  if (inputLower.includes('synchronization') || inputLower.includes('__syncthreads')) {
    return `Synchronization in CUDA is tricky! __syncthreads() only synchronizes threads within the same block, not across blocks. For global synchronization, you need to end the kernel and launch a new one. Avoid divergent branches before __syncthreads() as it can cause deadlocks. Warps (groups of 32 threads) execute in lockstep.`;
  }
  
  if (inputLower.includes('warp') || inputLower.includes('simt')) {
    return `Warps are fundamental to GPU execution! A warp is a group of 32 threads that execute the same instruction simultaneously (SIMT). When threads in a warp take different execution paths (branch divergence), performance degrades because both paths must be executed serially. Keep threads in a warp doing similar work for best performance.`;
  }
  
  if (inputLower.includes('coalescing') || inputLower.includes('memory access')) {
    return `Memory coalescing is critical for performance! When threads in a warp access consecutive memory addresses, the GPU combines these into a single transaction. Uncoalesced access can reduce bandwidth by 10x or more. Structure your data access patterns so thread 0 accesses address 0, thread 1 accesses address 1, etc.`;
  }
  
  if (inputLower.includes('optimization') || inputLower.includes('performance')) {
    return `CUDA optimization is an art! Key strategies: 1) Maximize occupancy (threads per SM), 2) Coalesce memory access, 3) Use shared memory to reduce global memory access, 4) Minimize divergent branching, 5) Choose optimal block sizes (multiples of 32), 6) Use streams for overlapping computation and memory transfer. Profile with nvprof or Nsight!`;
  }
  
  if (inputLower.includes('example') || inputLower.includes('code')) {
    return `Here's a simple vector addition kernel:\n\n__global__ void vectorAdd(float *a, float *b, float *c, int n) {\n    int i = blockIdx.x * blockDim.x + threadIdx.x;\n    if (i < n) c[i] = a[i] + b[i];\n}\n\nLaunch it with: vectorAdd<<<(n+255)/256, 256>>>(d_a, d_b, d_c, n);\n\nThis uses 256 threads per block and enough blocks to cover all elements. Try it in the code editor!`;
  }
  
  if (inputLower.includes('help') || inputLower.includes('stuck') || inputLower.includes('error')) {
    return `I'm here to help! Common CUDA issues: 1) Forgetting to check cudaGetLastError(), 2) Not handling partial blocks in kernels, 3) Race conditions in shared memory, 4) Exceeding resource limits (registers, shared memory), 5) Memory access violations. What specific problem are you facing? Feel free to paste your code!`;
  }
  
  // General responses based on keywords
  if (inputLower.includes('start') || inputLower.includes('begin')) {
    return `Perfect! Let's start your CUDA journey. CUDA programming involves three main steps: 1) Allocate GPU memory with cudaMalloc(), 2) Copy data to GPU with cudaMemcpy(), 3) Launch kernels to process data in parallel, 4) Copy results back. The key insight is thinking in parallel - how can you break your problem into thousands of independent tasks?`;
  }
  
  // Default responses for general questions
  const defaultResponses = [
    `That's a great question about "${input}"! In CUDA programming, understanding the parallel execution model is key. Each thread works on a small piece of data independently, allowing massive parallelism. What specific aspect would you like me to explain further?`,
    `Interesting point about "${input}"! This relates to how GPU architecture differs from CPU architecture. GPUs have thousands of lightweight cores designed for throughput, while CPUs have fewer powerful cores designed for latency. How does this apply to your current lesson?`,
    `Excellent question on "${input}"! This is fundamental to efficient CUDA programming. The key is understanding how threads are organized into warps and blocks, and how this maps to the GPU's streaming multiprocessors. Would you like me to elaborate on any particular aspect?`,
    `Good thinking about "${input}"! This concept is crucial for writing high-performance CUDA code. It's all about maximizing parallelism while minimizing memory access latency. Have you tried implementing this in the code editor yet?`
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

const ChatPanel = ({ lessonId }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (lessonId) {
      // Reset chat for new lesson
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Welcome to CudaCoach! 🚀 I'm your AI CUDA programming tutor. I'm here to help you master GPU programming, from basic concepts to advanced optimization techniques. Ask me anything about CUDA, GPU architecture, memory management, or kernel programming. Let's unlock the power of parallel computing together!`,
          timestamp: new Date()
        }
      ]);
    }
  }, [lessonId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Replace with actual API call to your Flask backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: currentInput,
          context: lessonId,
          conversation_history: messages.slice(-5) // Send last 5 messages for context
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
              // Enhanced mock responses for demo with comprehensive CUDA knowledge
        const response = getCudaResponse(currentInput);
        
        // Simulate typing delay for more realistic feel
        setTimeout(() => {
          const assistantMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, assistantMessage]);
          setIsLoading(false);
        }, 1200 + Math.random() * 800); // Random delay between 1.2-2 seconds
      
      return; // Exit early for mock response
    } finally {
      // setIsLoading is handled in the setTimeout for mock response
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="flex flex-col h-full shadow-lg">
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg floating">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-primary">AI Tutor</h3>
            <p className="text-xs text-muted-foreground">
              {isLoading ? 'Typing...' : 'Online • Ready to help'}
            </p>
          </div>
        </div>
      </div>

      <CardContent className="flex flex-col h-full p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-fade-in ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center shadow-md">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
                
                <div className={`max-w-[85%] ${message.role === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm animate-scale-in ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground'
                        : 'bg-card border border-border'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 px-2 flex items-center gap-1">
                    {formatTime(message.timestamp)}
                    {message.role === 'user' && <span className="text-primary">•</span>}
                  </p>
                </div>
                
                {message.role === 'user' && (
                  <div className="flex-shrink-0 order-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center shadow-md">
                      <User className="h-4 w-4 text-secondary-foreground" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start animate-fade-in">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center shadow-md">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
                <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="border-t border-border p-4 bg-muted/30">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about CUDA programming..."
                disabled={isLoading}
                className="pr-12 rounded-full border-2 focus:border-primary/50 transition-all duration-200"
              />
              {inputValue.trim() && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                  {inputValue.length}/500
                </div>
              )}
            </div>
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              variant="gradient"
              className="rounded-full w-10 h-10 shadow-lg"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick suggestions */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {!isLoading && messages.length <= 1 && [
              "What is CUDA?",
              "Explain GPU vs CPU architecture",
              "How do CUDA threads work?",
              "What are kernels?",
              "Show me memory optimization tips",
              "Help with thread synchronization"
            ].map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs rounded-full"
                onClick={() => setInputValue(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatPanel; 