import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface WorldPosition {
  x: number;
  y: number;
  z: number;
}

interface Dragon {
  id: string;
  name: string;
  image: string;
}

interface DragonWorldProps {
  selectedDragon: Dragon | null;
  onBack: () => void;
}

const DragonWorld = ({ selectedDragon, onBack }: DragonWorldProps) => {
  const [position, setPosition] = useState<WorldPosition>({ x: 50, y: 50, z: 50 });
  const [isFlying, setIsFlying] = useState(false);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [coins, setCoins] = useState(0);
  const worldRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const locations = [
    { x: 20, y: 30, z: 30, name: 'Огненная Гора', icon: 'Flame', color: 'from-orange-500 to-red-600', size: 80 },
    { x: 80, y: 40, z: 20, name: 'Ледяные Пики', icon: 'Snowflake', color: 'from-cyan-400 to-blue-600', size: 100 },
    { x: 50, y: 70, z: 40, name: 'Тёмный Лес', icon: 'Trees', color: 'from-purple-600 to-indigo-900', size: 90 },
    { x: 30, y: 80, z: 60, name: 'Светлый Храм', icon: 'Sparkles', color: 'from-yellow-300 to-amber-400', size: 70 },
    { x: 70, y: 20, z: 80, name: 'Небесный Остров', icon: 'Cloud', color: 'from-teal-300 to-sky-500', size: 110 },
  ];

  const collectibles = [
    { x: 35, y: 45, z: 45, collected: false, id: 1 },
    { x: 65, y: 55, z: 35, collected: false, id: 2 },
    { x: 45, y: 35, z: 55, collected: false, id: 3 },
    { x: 55, y: 65, z: 65, collected: false, id: 4 },
    { x: 40, y: 60, z: 40, collected: false, id: 5 },
    { x: 75, y: 50, z: 50, collected: false, id: 6 },
    { x: 25, y: 50, z: 45, collected: false, id: 7 },
  ];

  const [collectedItems, setCollectedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.key.toLowerCase()));
      if (e.key === ' ') {
        e.preventDefault();
        setIsFlying(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(e.key.toLowerCase());
        return newKeys;
      });
      if (e.key === ' ') {
        setIsFlying(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const gameLoop = () => {
      setPosition(prev => {
        let newX = prev.x;
        let newY = prev.y;
        let newZ = prev.z;
        const speed = isFlying ? 0.5 : 0.3;

        if (keys.has('w') || keys.has('arrowup')) newY = Math.max(0, newY - speed);
        if (keys.has('s') || keys.has('arrowdown')) newY = Math.min(100, newY + speed);
        if (keys.has('a') || keys.has('arrowleft')) newX = Math.max(0, newX - speed);
        if (keys.has('d') || keys.has('arrowright')) newX = Math.min(100, newX + speed);
        
        if (isFlying) {
          if (keys.has('shift')) newZ = Math.max(0, newZ - 0.4);
          if (keys.has('control')) newZ = Math.min(100, newZ + 0.4);
        }

        collectibles.forEach(item => {
          if (!collectedItems.has(item.id)) {
            const distance = Math.sqrt(
              Math.pow(newX - item.x, 2) + Math.pow(newY - item.y, 2) + Math.pow(newZ - item.z, 2)
            );
            if (distance < 5) {
              setCollectedItems(prev => new Set(prev).add(item.id));
              setCoins(c => c + 10);
              toast.success('Найдено 10 монет! 💰');
            }
          }
        });

        return { x: newX, y: newY, z: newZ };
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [keys, isFlying, collectedItems]);

  const checkNearLocation = () => {
    return locations.find(loc => {
      const distance = Math.sqrt(
        Math.pow(position.x - loc.x, 2) + Math.pow(position.y - loc.y, 2) + Math.pow(position.z - loc.z, 2)
      );
      return distance < 12;
    });
  };

  const get3DScale = (z: number) => {
    return 0.4 + (z / 100) * 0.8;
  };

  const get3DPosition = (x: number, y: number, z: number) => {
    const perspective = 500;
    const scale = get3DScale(z);
    return {
      left: `${x}%`,
      top: `${y}%`,
      transform: `translate(-50%, -50%) scale(${scale})`,
      zIndex: Math.floor(z)
    };
  };

  const nearLocation = checkNearLocation();

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-sky-400 via-purple-300 to-blue-900 overflow-hidden">
      <div 
        ref={worldRef}
        className="relative w-full h-full"
        style={{
          backgroundImage: 'url(/img/f3224aef-4236-4b87-99f3-69ec9a504018.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-slate-900/40"></div>

        {locations.map((loc, index) => {
          const scale = get3DScale(loc.z);
          const iconSize = Math.floor(loc.size * scale / 2);
          return (
            <div
              key={index}
              className={`absolute bg-gradient-to-br ${loc.color} rounded-full p-4 shadow-2xl border-2 border-white/30 transition-all duration-300`}
              style={{
                ...get3DPosition(loc.x, loc.y, loc.z),
                opacity: 0.7 + (loc.z / 200)
              }}
            >
              <Icon name={loc.icon as any} size={iconSize} className="text-white" />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-full w-16 h-2 blur-sm" style={{ transform: `translateX(-50%) scaleX(${scale})` }}></div>
            </div>
          );
        })}

        {collectibles.map((item) => {
          if (collectedItems.has(item.id)) return null;
          const scale = get3DScale(item.z);
          return (
            <div
              key={item.id}
              className="absolute animate-bounce transition-all duration-300"
              style={{
                ...get3DPosition(item.x, item.y, item.z),
                opacity: 0.8 + (item.z / 200)
              }}
            >
              <div className="bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full p-3 shadow-xl border-2 border-yellow-300 animate-glow">
                <Icon name="Coins" size={Math.floor(24 * scale)} className="text-white" />
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-black/30 rounded-full w-8 h-1 blur-sm" style={{ transform: `translateX(-50%) scaleX(${scale})` }}></div>
            </div>
          );
        })}

        {selectedDragon && (
          <div
            className={`absolute transition-all duration-100 ${isFlying ? 'animate-float' : ''}`}
            style={{
              ...get3DPosition(position.x, position.y, position.z),
              filter: isFlying ? 'drop-shadow(0 0 20px rgba(147, 51, 234, 0.8))' : 'none'
            }}
          >
            <div className="relative">
              <img
                src={selectedDragon.image}
                alt={selectedDragon.name}
                className="w-24 h-24 rounded-full border-4 border-purple-500 shadow-2xl object-cover"
                style={{
                  transform: isFlying ? 'rotate(-5deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s'
                }}
              />
              {isFlying && (
                <>
                  <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🦅</div>
                </>
              )}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-black/40 rounded-full w-20 h-3 blur-md" style={{ transform: `translateX(-50%) scaleY(${isFlying ? 0.5 : 1})` }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        <Button
          onClick={onBack}
          className="bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800/90 text-white"
        >
          <Icon name="ArrowLeft" className="mr-2" size={20} />
          Назад
        </Button>

        <div className="flex gap-4">
          <Card className="bg-slate-900/80 backdrop-blur-sm px-6 py-3 border-amber-500/50">
            <div className="flex items-center gap-2">
              <Icon name="Coins" className="text-amber-400" size={24} />
              <span className="text-2xl font-bold text-white">{coins}</span>
            </div>
          </Card>
          <Card className="bg-slate-900/80 backdrop-blur-sm px-6 py-3 border-purple-500/50">
            <div className="text-center">
              <p className="text-xs text-purple-300">Высота</p>
              <div className="flex items-center gap-2">
                <Icon name="ArrowUp" className="text-purple-400" size={20} />
                <span className="text-xl font-bold text-white">{Math.floor(position.z)}м</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {nearLocation && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <Card className={`bg-gradient-to-br ${nearLocation.color} p-6 border-2 border-white/50 shadow-2xl animate-scale-in`}>
            <div className="text-center text-white">
              <Icon name={nearLocation.icon as any} size={48} className="mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-2">{nearLocation.name}</h3>
              <p className="text-sm opacity-90">Вы прибыли в эту локацию!</p>
            </div>
          </Card>
        </div>
      )}

      <Card className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-900/80 backdrop-blur-sm px-8 py-4 border-purple-500/50">
        <div className="text-center">
          <p className="text-white font-bold mb-2">Управление</p>
          <div className="flex gap-4 text-purple-200 text-sm">
            <span>WASD / Стрелки - Движение</span>
            <span>Пробел - {isFlying ? '🦅 Полёт' : '🏃 Бег'}</span>
            {isFlying && <span className="text-cyan-300">Shift/Ctrl - Вверх/Вниз</span>}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DragonWorld;