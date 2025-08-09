import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Gamepad2, Trophy, Shield, Star, ArrowRight, Play, Users } from "lucide-react"

// Custom Steam Icon Component with Neon Styling
const SteamIcon = () => (
  // This is a custom SVG inspired by the Steam logo, not the official one.
  // The official Steam logo is trademarked and not available for free use.
  // This SVG uses circles and lines to evoke the Steam logo's style, but will not look exactly like the real Steam logo.
  // For a more accurate icon, consider using a licensed icon set or the Lucide/Feather "Steam" icon if available.
<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 128 128">
<path fill="#fff" d="M55,97c-0.8,0-1.6-0.2-2.4-0.5L8.7,77.2c-3-1.3-4.4-4.9-3.1-7.9c1.3-3,4.9-4.4,7.9-3.1l43.9,19.2 c3,1.3,4.4,4.9,3.1,7.9C59.5,95.7,57.3,97,55,97z"></path><path fill="#fff" d="M97,24c-13.8,0-25,11.2-25,25c0,0.3,0,0.7,0,1L53.9,73.1C44.5,73.6,37,81.4,37,91c0,9.9,8.1,18,18,18 c9.6,0,17.4-7.5,17.9-16.9C79.8,86.8,88.8,79.7,96,74c0.3,0,0.7,0,1,0c13.8,0,25-11.2,25-25S110.8,24,97,24z"></path><path fill="#444b54" d="M55,112c-6.3,0-12.2-2.8-16.2-7.6c-1.1-1.3-0.9-3.2,0.4-4.2c1.3-1.1,3.2-0.9,4.2,0.4 c2.9,3.4,7.1,5.4,11.5,5.4c7.9,0,14.5-6.2,14.9-14c0-0.2,0-0.4,0.1-0.5c0-0.1,0-0.3,0-0.4c0-8.2-6.7-15-14.9-15L54,76.1 c-1.2,0.1-2.3-0.6-2.8-1.6c-0.5-1-0.4-2.3,0.3-3.2L69,49c0-15.4,12.6-28,28-28c15.4,0,28,12.6,28,28c0,15.4-12.6,28-28,28 L75.8,93.7C74.5,104.1,65.6,112,55,112z M59.7,70.5c7.8,1.8,14,8,15.8,15.8l18.7-14.7c0.6-0.4,1.3-0.7,2-0.6c0.3,0,0.6,0,0.9,0 c12.1,0,22-9.9,22-22s-9.9-22-22-22s-22,9.9-22,22c0,0.3,0,0.6,0,0.9c0,0.7-0.2,1.4-0.6,2L59.7,70.5z"></path><path fill="#444b54" d="M97,66c-9.4,0-17-7.6-17-17s7.6-17,17-17s17,7.6,17,17S106.4,66,97,66z M97,38c-6.1,0-11,4.9-11,11 s4.9,11,11,11s11-4.9,11-11S103.1,38,97,38z"></path><path fill="#444b54" d="M55,100c-1.2,0-2.5-0.3-3.6-0.8L7.5,80C3,78,0.9,72.7,2.9,68.1c1-2.2,2.7-3.9,5-4.8c2.2-0.9,4.7-0.8,6.9,0.1 l43.9,19.2c4.5,2,6.6,7.3,4.6,11.9C61.8,97.9,58.6,100,55,100z M11.1,68.7c-0.4,0-0.7,0.1-1.1,0.2c-0.7,0.3-1.3,0.9-1.7,1.6 c-0.7,1.5,0,3.3,1.5,4l43.9,19.2c0.4,0.2,0.8,0.3,1.2,0.3c1.2,0,2.3-0.7,2.8-1.8c0.7-1.5,0-3.3-1.5-4L12.3,69 C11.9,68.8,11.5,68.7,11.1,68.7z"></path>
</svg>
)

export default function LandingPage() {
  const featuredItems = [{
      "assetid": "15290241643",
      "classid": "1923037342",
      "instanceid": "0",
      "contextid": "2",
      "appid": 730,
      "amount": "1",
      "icon_url": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bjz61TqQCKj0JfipHMN7aX2bfM9eaPDXT7Glbx1s7Y8HHHnw0sltWXSmYmqcH-UaAU-Sswn_16VNj0",
      "name": "Gamma 2 Case",
      "type": "Base Grade Container",
      "price": "0.05 SUI",
    },
    {
      "assetid": "15276775867",
      "classid": "310776573",
      "instanceid": "302028390",
      "contextid": "2",
      "appid": 730,
      "amount": "1",
      "icon_url": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f7jJk-_O-bZt-KP-BGliDwOByj-xsSyCmmFNxtm_Sntf6d37EaA4mAsZyFOdZsBbpm4XjM-_r4weKjI9GyC3-iilK8G81tNuN7upC",
      "name": "MP9 | Sand Dashed",
      "type": "Consumer Grade SMG",
      "price": "0.02 SUI",
    },
    {
      "assetid": "41713930254",
      "classid": "4356734261",
      "instanceid": "0",
      "contextid": "2",
      "appid": 730,
      "amount": "1",
      "icon_url": "i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIijyEKzb_3d19nuPXqT4EVKpNa6vgi0EkugzcO2q3Nfu6D8OPc0JvXEXjeVkexw5OIxHn7lzUVx4mTRn8HpLyy5vFaXRw",
      "name": "Music Kit | Darren Korb, Hades Music Kit",
      "type": "High Grade Music Kit",
      "price": "0.15 SUI",
    },]
  
  const features = [
    {
      icon: SteamIcon,
      title: "Steam Integration",
      description: "Direct connection to your Steam inventory for seamless trading",
    },
    {
      icon: Shield,
      title: "Secure Trading",
      description: "Blockchain-powered escrow protects your items",
    },
    {
      icon: Trophy,
      title: "Rare Items",
      description: "Find and trade rare, discontinued, and collectible items",
    },
    {
      icon: Users,
      title: "Community Market",
      description: "Buy and sell with thousands of Steam traders",
    },
  ]

  const stats = [
    { label: "Total Volume", value: "2.5M SUI", glow: "cyan" },
    { label: "Active Traders", value: "150K+", glow: "pink" },
    { label: "Items Listed", value: "500K+", glow: "purple" },
    { label: "Games Supported", value: "100+", glow: "cyan" },
  ]

  return (
    <div className="min-h-screen cyber-grid scan-lines">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <Badge className="mb-6 neon-border-cyan bg-cyan-500/10 text-cyan-400 border-cyan-400/50">
              <span style={{marginRight: "0.5rem"}}>
                <SteamIcon/>
              </span>
              
              POWERED BY STEAM & SUI BLOCKCHAIN
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="glitch-text neon-text-cyan" data-text="STEAM">
                PUDEEZ
              </span>
              <span className="block mt-2">
                <span className="neon-text-pink">MARKET</span><span className="neon-text-purple">PLACE</span>
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto font-mono">
              Trade your Steam skins and items with zero fees. The cyberpunk marketplace for CS:GO, Dota 2, TF2 and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link to="/marketplace">
                <Button
                  size="lg"
                  className="w-full sm:w-auto neon-button-cyan px-8 py-4 text-lg font-semibold rounded-none font-mono uppercase tracking-wider transform hover:scale-105"
                >
                  <Gamepad2 className="w-6 h-6 mr-3" />
                  BROWSE ITEMS
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
                {window.localStorage.getItem("walletAddress") ? (
                <Link to="/inventory">
                  <Button
                  size="lg"
                  className="w-full sm:w-auto neon-button-purple px-8 py-4 text-lg font-semibold rounded-none font-mono uppercase tracking-wider transform hover:scale-105"
                  >
                  <Play className="w-6 h-6 mr-3" />
                  SELL YOUR ITEMS
                  </Button>
                </Link>
                ) : (
                <Link to="/sign-up">
                  <Button
                  size="lg"
                  className="w-full sm:w-auto neon-button-purple px-8 py-4 text-lg font-semibold rounded-none font-mono uppercase tracking-wider transform hover:scale-105"
                  >
                  <Play className="w-6 h-6 mr-3" />
                  SELL YOUR ITEMS
                  </Button>
                </Link>
                )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black/40 backdrop-blur-sm border-y border-cyan-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className={`text-3xl md:text-4xl font-bold mb-2 font-mono ${
                    stat.glow === "cyan"
                      ? "neon-text-cyan"
                      : stat.glow === "pink"
                        ? "neon-text-pink"
                        : "neon-text-purple"
                  }`}
                >
                  {stat.value}
                </div>
                <div className="text-gray-400 font-mono uppercase tracking-wider text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">
              <span className="neon-text-cyan">TRADING</span> <span className="neon-text-pink">FEATURES</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-mono">
              Next-gen trading powered by blockchain technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const colors = ["cyan", "pink", "purple", "cyan"]
              const color = colors[index % colors.length]

              return (
                <div
                  key={index}
                  className={`cyber-card p-6 text-center transform hover:scale-105 transition-all duration-300 ${
                    color === "cyan"
                      ? "hover:border-cyan-400/50"
                      : color === "pink"
                        ? "hover:border-pink-400/50"
                        : "hover:border-purple-400/50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-none flex items-center justify-center mx-auto mb-4 ${
                      color === "cyan"
                        ? "bg-cyan-500/20 border border-cyan-400/50"
                        : color === "pink"
                          ? "bg-pink-500/20 border border-pink-400/50"
                          : "bg-purple-500/20 border border-purple-400/50"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        color === "cyan" ? "text-cyan-400" : color === "pink" ? "text-pink-400" : "text-purple-400"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-xl font-semibold mb-2 font-mono uppercase tracking-wider ${
                      color === "cyan" ? "text-cyan-400" : color === "pink" ? "text-pink-400" : "text-purple-400"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 font-mono text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Items Preview */}
      <section className="py-20 bg-black/20 border-y border-purple-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">
              <span className="neon-text-purple">FEATURED</span> <span className="neon-text-cyan">ITEMS</span>
            </h2>
            <p className="text-xl text-gray-300 font-mono">Trade items from top Steam games</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <div
                key={item.assetid}
                className="cyber-card overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className="aspect-square bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 relative overflow-hidden border-b border-cyan-400/20">
                  <img
                    src={`https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url}`}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="neon-border-cyan bg-cyan-500/20 text-cyan-400">
                      <Star className="w-3 h-3 mr-1" />
                      POPULAR
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6 flex flex-col h-[180px]">
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-2 font-mono neon-text-cyan">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 mb-4 font-mono text-sm">{item.type}</p>
                  </div>
                  <div className="flex justify-between items-end mt-auto">
                    <span className="neon-text-pink font-mono font-bold">{item.price}</span>
                    <Link 
                      to={`/view/${item.assetid}`}
                      state={item}
                      className="w-[120px]"
                    >
                      <Button size="sm" className="neon-button-purple font-mono uppercase text-xs w-full">
                        TRADE NOW
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-mono">
            <span className="neon-text-cyan">READY TO</span> <span className="neon-text-pink">START TRADING?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 font-mono">
            Connect your Steam account and join the cyberpunk marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/sign-up">
              <Button size="lg" className="neon-button-cyan font-mono uppercase tracking-wider">
                CONNECT STEAM
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}