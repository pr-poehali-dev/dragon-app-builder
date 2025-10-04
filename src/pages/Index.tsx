import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type DragonElement = 'fire' | 'ice' | 'shadow' | 'light' | 'earth' | 'wind';
type DragonRarity = 'common' | 'rare' | 'epic' | 'legendary';

interface Dragon {
  id: string;
  name: string;
  element: DragonElement;
  rarity: DragonRarity;
  power: number;
  hp: number;
  speed: number;
  image: string;
}

const DRAGONS_POOL: Omit<Dragon, 'id'>[] = [
  { name: 'Огненный Властелин', element: 'fire', rarity: 'legendary', power: 95, hp: 85, speed: 12, image: '/img/297e1d8b-1330-4b82-842b-006642877feb.jpg' },
  { name: 'Ледяной Страж', element: 'ice', rarity: 'epic', power: 75, hp: 90, speed: 8, image: '/img/4de6531c-8d1c-4b3c-9db7-8d0ad61e00f5.jpg' },
  { name: 'Теневой Охотник', element: 'shadow', rarity: 'epic', power: 80, hp: 70, speed: 15, image: '/img/a72e20cb-05dc-4813-9197-843755755fe2.jpg' },
  { name: 'Световой Защитник', element: 'light', rarity: 'rare', power: 60, hp: 75, speed: 10, image: '/img/a72e20cb-05dc-4813-9197-843755755fe2.jpg' },
  { name: 'Земной Титан', element: 'earth', rarity: 'rare', power: 65, hp: 95, speed: 5, image: '/img/297e1d8b-1330-4b82-842b-006642877feb.jpg' },
  { name: 'Ветряный Скиталец', element: 'wind', rarity: 'common', power: 45, hp: 55, speed: 18, image: '/img/4de6531c-8d1c-4b3c-9db7-8d0ad61e00f5.jpg' },
  { name: 'Малый Огненный', element: 'fire', rarity: 'common', power: 40, hp: 50, speed: 9, image: '/img/297e1d8b-1330-4b82-842b-006642877feb.jpg' },
  { name: 'Ледяная Чешуя', element: 'ice', rarity: 'rare', power: 55, hp: 70, speed: 8, image: '/img/4de6531c-8d1c-4b3c-9db7-8d0ad61e00f5.jpg' },
];

const RARITY_CHANCES = {
  legendary: 2,
  epic: 8,
  rare: 25,
  common: 65
};

const ELEMENT_COLORS: Record<DragonElement, string> = {
  fire: 'from-orange-500 to-red-600',
  ice: 'from-cyan-400 to-blue-600',
  shadow: 'from-purple-600 to-indigo-900',
  light: 'from-yellow-300 to-amber-400',
  earth: 'from-green-600 to-emerald-800',
  wind: 'from-teal-300 to-sky-500'
};

const RARITY_COLORS: Record<DragonRarity, string> = {
  legendary: 'from-yellow-400 via-amber-500 to-orange-600',
  epic: 'from-purple-500 via-violet-600 to-fuchsia-700',
  rare: 'from-blue-500 to-cyan-600',
  common: 'from-gray-400 to-slate-500'
};

const Index = () => {
  const [crystals, setCrystals] = useState(500);
  const [premiumCrystals, setPremiumCrystals] = useState(100);
  const [collection, setCollection] = useState<Dragon[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [lastSummon, setLastSummon] = useState<Dragon | null>(null);

  const getRarityByChance = (): DragonRarity => {
    const rand = Math.random() * 100;
    let cumulative = 0;
    
    for (const [rarity, chance] of Object.entries(RARITY_CHANCES)) {
      cumulative += chance;
      if (rand <= cumulative) {
        return rarity as DragonRarity;
      }
    }
    return 'common';
  };

  const summonDragon = (isPremium: boolean = false) => {
    const cost = isPremium ? 10 : 50;
    const currency = isPremium ? premiumCrystals : crystals;
    
    if (currency < cost) {
      toast.error('Недостаточно кристаллов!');
      return;
    }

    setIsRevealing(true);
    
    setTimeout(() => {
      const targetRarity = getRarityByChance();
      const availableDragons = DRAGONS_POOL.filter(d => d.rarity === targetRarity);
      const dragonTemplate = availableDragons[Math.floor(Math.random() * availableDragons.length)];
      
      const newDragon: Dragon = {
        ...dragonTemplate,
        id: Date.now().toString()
      };

      setCollection(prev => [...prev, newDragon]);
      setLastSummon(newDragon);
      
      if (isPremium) {
        setPremiumCrystals(prev => prev - cost);
      } else {
        setCrystals(prev => prev - cost);
      }

      toast.success(`Получен ${newDragon.rarity === 'legendary' ? 'легендарный' : newDragon.rarity === 'epic' ? 'эпический' : newDragon.rarity === 'rare' ? 'редкий' : 'обычный'} дракон!`);
      setIsRevealing(false);
    }, 600);
  };

  const getRarityText = (rarity: DragonRarity): string => {
    const map = { legendary: 'Легендарный', epic: 'Эпический', rare: 'Редкий', common: 'Обычный' };
    return map[rarity];
  };

  const getElementText = (element: DragonElement): string => {
    const map = { fire: 'Огонь', ice: 'Лёд', shadow: 'Тьма', light: 'Свет', earth: 'Земля', wind: 'Ветер' };
    return map[element];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzMzZWEiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCA0LTRoNHYtNGgtNGMtMiAwLTQtMi00LTR2LTRoLTR2NGMwIDItMiA0LTQgNGgtNHY0aDRjMiAwIDQgMiA0IDR2NGg0di00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
            DRAGON~
          </h1>
          
          <div className="flex justify-center gap-6 mt-6">
            <div className="bg-gradient-to-br from-blue-600/30 to-cyan-600/30 backdrop-blur-sm px-6 py-3 rounded-2xl border border-cyan-500/50 shadow-lg">
              <div className="flex items-center gap-2">
                <Icon name="Gem" className="text-cyan-400" size={24} />
                <span className="text-2xl font-bold text-white">{crystals}</span>
              </div>
              <p className="text-xs text-cyan-200 mt-1">Кристаллы</p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-600/30 to-yellow-500/30 backdrop-blur-sm px-6 py-3 rounded-2xl border border-amber-400/50 shadow-lg">
              <div className="flex items-center gap-2">
                <Icon name="Sparkles" className="text-amber-400" size={24} />
                <span className="text-2xl font-bold text-white">{premiumCrystals}</span>
              </div>
              <p className="text-xs text-amber-200 mt-1">Премиум</p>
            </div>
          </div>
        </header>

        <Tabs defaultValue="summon" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-800/50 backdrop-blur-sm">
            <TabsTrigger value="summon" className="data-[state=active]:bg-purple-600">
              <Icon name="Sparkles" size={18} className="mr-2" />
              Призыв
            </TabsTrigger>
            <TabsTrigger value="collection" className="data-[state=active]:bg-purple-600">
              <Icon name="Library" size={18} className="mr-2" />
              Коллекция
            </TabsTrigger>
            <TabsTrigger value="shop" className="data-[state=active]:bg-purple-600">
              <Icon name="ShoppingBag" size={18} className="mr-2" />
              Магазин
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summon" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-white">Призыв Драконов</h2>
              <p className="text-purple-200">Призови могущественного дракона себе в помощники!</p>
            </div>

            {lastSummon && (
              <Card className={`p-6 bg-gradient-to-br ${RARITY_COLORS[lastSummon.rarity]} border-2 border-white/30 shadow-2xl animate-reveal max-w-md mx-auto`}>
                <div className="text-center">
                  <Badge className="mb-4 text-lg px-4 py-1 bg-black/30">{getRarityText(lastSummon.rarity)}</Badge>
                  <img 
                    src={lastSummon.image} 
                    alt={lastSummon.name}
                    className="w-full h-64 object-cover rounded-xl mb-4 shadow-xl"
                  />
                  <h3 className="text-2xl font-bold text-white mb-2">{lastSummon.name}</h3>
                  <Badge className={`bg-gradient-to-r ${ELEMENT_COLORS[lastSummon.element]} text-white px-4 py-1`}>
                    {getElementText(lastSummon.element)}
                  </Badge>
                  <div className="grid grid-cols-3 gap-4 mt-4 text-white">
                    <div>
                      <Icon name="Zap" className="mx-auto mb-1" size={20} />
                      <p className="text-sm">Сила</p>
                      <p className="text-xl font-bold">{lastSummon.power}</p>
                    </div>
                    <div>
                      <Icon name="Heart" className="mx-auto mb-1" size={20} />
                      <p className="text-sm">HP</p>
                      <p className="text-xl font-bold">{lastSummon.hp}</p>
                    </div>
                    <div>
                      <Icon name="Gauge" className="mx-auto mb-1" size={20} />
                      <p className="text-sm">Скорость</p>
                      <p className="text-xl font-bold">{lastSummon.speed}</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="p-8 bg-gradient-to-br from-slate-800/90 to-purple-900/90 backdrop-blur-sm border-2 border-purple-500/50 hover:border-purple-400 transition-all hover:shadow-2xl hover:shadow-purple-500/50">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center animate-glow">
                    <Icon name="Gem" size={40} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">Обычный Призыв</h3>
                  <p className="text-purple-200 mb-6">Используй обычные кристаллы</p>
                  <Button 
                    onClick={() => summonDragon(false)}
                    disabled={isRevealing || crystals < 50}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-6 text-lg shadow-lg disabled:opacity-50"
                  >
                    {isRevealing ? 'Призыв...' : 'Призвать за 50 💎'}
                  </Button>
                  <p className="text-xs text-purple-300 mt-4">
                    Легендарный: 2% | Эпический: 8% | Редкий: 25% | Обычный: 65%
                  </p>
                </div>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-slate-800/90 to-amber-900/90 backdrop-blur-sm border-2 border-amber-500/50 hover:border-amber-400 transition-all hover:shadow-2xl hover:shadow-amber-500/50">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center animate-glow">
                    <Icon name="Sparkles" size={40} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">Премиум Призыв</h3>
                  <p className="text-amber-200 mb-6">Используй премиум кристаллы</p>
                  <Button 
                    onClick={() => summonDragon(true)}
                    disabled={isRevealing || premiumCrystals < 10}
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white font-bold py-6 text-lg shadow-lg disabled:opacity-50"
                  >
                    {isRevealing ? 'Призыв...' : 'Призвать за 10 ✨'}
                  </Button>
                  <p className="text-xs text-amber-300 mt-4">
                    Легендарный: 2% | Эпический: 8% | Редкий: 25% | Обычный: 65%
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="collection">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-white">Моя Коллекция</h2>
              <p className="text-purple-200">Всего драконов: {collection.length}</p>
            </div>

            {collection.length === 0 ? (
              <div className="text-center py-20">
                <Icon name="Frown" size={64} className="mx-auto mb-4 text-purple-400 opacity-50" />
                <p className="text-xl text-purple-300">Коллекция пуста</p>
                <p className="text-purple-400 mt-2">Призови своего первого дракона!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collection.map((dragon) => (
                  <Card 
                    key={dragon.id}
                    className={`p-4 bg-gradient-to-br from-slate-800/90 to-purple-900/90 backdrop-blur-sm border-2 ${
                      dragon.rarity === 'legendary' ? 'border-amber-400 animate-glow' :
                      dragon.rarity === 'epic' ? 'border-purple-400' :
                      dragon.rarity === 'rare' ? 'border-blue-400' :
                      'border-slate-500'
                    } hover:scale-105 transition-transform`}
                  >
                    <Badge className={`mb-2 bg-gradient-to-r ${RARITY_COLORS[dragon.rarity]}`}>
                      {getRarityText(dragon.rarity)}
                    </Badge>
                    <img 
                      src={dragon.image}
                      alt={dragon.name}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                    <h3 className="text-xl font-bold text-white mb-2">{dragon.name}</h3>
                    <Badge className={`bg-gradient-to-r ${ELEMENT_COLORS[dragon.element]} text-white mb-3`}>
                      {getElementText(dragon.element)}
                    </Badge>
                    <div className="grid grid-cols-3 gap-2 text-white text-sm">
                      <div className="text-center">
                        <Icon name="Zap" className="mx-auto" size={16} />
                        <p className="font-bold">{dragon.power}</p>
                      </div>
                      <div className="text-center">
                        <Icon name="Heart" className="mx-auto" size={16} />
                        <p className="font-bold">{dragon.hp}</p>
                      </div>
                      <div className="text-center">
                        <Icon name="Gauge" className="mx-auto" size={16} />
                        <p className="font-bold">{dragon.speed}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="shop">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-white">Магазин Кристаллов</h2>
              <p className="text-purple-200">Пополни запасы кристаллов для призыва</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="p-6 bg-gradient-to-br from-slate-800/90 to-blue-900/90 backdrop-blur-sm border-2 border-blue-500/50 hover:border-blue-400 transition-all hover:scale-105">
                <div className="text-center">
                  <Icon name="Gem" className="mx-auto mb-4 text-cyan-400" size={48} />
                  <h3 className="text-2xl font-bold text-white mb-2">100 Кристаллов</h3>
                  <p className="text-3xl font-bold text-cyan-400 mb-4">₽99</p>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500">
                    Купить
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-slate-800/90 to-purple-900/90 backdrop-blur-sm border-2 border-purple-500/50 hover:border-purple-400 transition-all hover:scale-105">
                <div className="text-center">
                  <Badge className="mb-2 bg-green-500">Выгодно</Badge>
                  <Icon name="Gem" className="mx-auto mb-4 text-cyan-400" size={48} />
                  <h3 className="text-2xl font-bold text-white mb-2">500 Кристаллов</h3>
                  <p className="text-3xl font-bold text-cyan-400 mb-4">₽399</p>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500">
                    Купить
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-slate-800/90 to-amber-900/90 backdrop-blur-sm border-2 border-amber-500/50 hover:border-amber-400 transition-all hover:scale-105 animate-glow">
                <div className="text-center">
                  <Badge className="mb-2 bg-gradient-to-r from-amber-400 to-yellow-500">Лучшее предложение</Badge>
                  <Icon name="Sparkles" className="mx-auto mb-4 text-amber-400" size={48} />
                  <h3 className="text-2xl font-bold text-white mb-2">50 Премиум</h3>
                  <p className="text-3xl font-bold text-amber-400 mb-4">₽599</p>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500">
                    Купить
                  </Button>
                </div>
              </Card>
            </div>

            <div className="mt-12 max-w-2xl mx-auto">
              <Card className="p-6 bg-gradient-to-br from-green-800/50 to-emerald-900/50 backdrop-blur-sm border-2 border-green-500/50">
                <div className="text-center">
                  <Icon name="Gift" className="mx-auto mb-4 text-green-400" size={48} />
                  <h3 className="text-2xl font-bold text-white mb-2">Ежедневная Награда</h3>
                  <p className="text-green-200 mb-4">Получай бесплатные кристаллы каждый день!</p>
                  <Button 
                    onClick={() => {
                      setCrystals(prev => prev + 50);
                      toast.success('Получено 50 кристаллов!');
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500"
                  >
                    Забрать 50 💎
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
