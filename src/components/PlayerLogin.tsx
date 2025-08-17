import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PlayerLoginProps {
  onLogin: (username: string) => void;
  className?: string;
}

const PlayerLogin: React.FC<PlayerLoginProps> = ({ onLogin, className }) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    // Simulate loading delay for dramatic effect
    setTimeout(() => {
      onLogin(username.trim());
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-4",
      "bg-background",
      className
    )}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-casino-green/10 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 border-gradient-gold bg-card/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-primary-foreground">UNO</span>
          </div>
          
          <CardTitle className="text-3xl font-bold text-gradient-gold">
            Uno Gamble Online
          </CardTitle>
          
          <CardDescription className="text-base text-muted-foreground">
            Enter your username to start playing with virtual currency
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-center text-lg border-gold/30 focus:border-gold focus:ring-gold/20"
                maxLength={20}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gold hover:bg-gold/80 text-primary-foreground font-bold text-lg py-6"
              disabled={!username.trim() || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  Entering Casino...
                </div>
              ) : (
                'Start Playing'
              )}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              🎰 Starting Balance: <span className="text-gold font-bold">$500</span>
            </div>
            <div className="text-xs text-muted-foreground/80">
              Your progress is automatically saved
            </div>
          </div>

          {/* Game features preview */}
          <div className="pt-4 border-t border-gold/20">
            <div className="text-xs text-center text-muted-foreground mb-3">Game Features</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-win rounded-full"></div>
                Multiplayer Rounds
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-gold rounded-full"></div>
                Virtual Betting
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                Persistent Stats
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Smooth Animations
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerLogin;