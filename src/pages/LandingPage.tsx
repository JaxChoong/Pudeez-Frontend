import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Gamepad2, Palette, Shield, Star, ArrowRight, Play, Sparkles, Cpu, Database, Network } from "lucide-react"

export default function LandingPage() {
  const featuredCollections = [
    {name: "Cyber Warriors", image: "/placeholder.svg?height=300&width=300&query=Cyberpunk NFT collection 1", desc: "Exclusive gaming collection", price: "2.5 SUI"},
    {name: "Neon Dreams", image: "/placeholder.svg?height=300&width=300&query=Cyberpunk NFT collection 2", desc: "Artistic expression in the metaverse", price: "3.0 SUI"},
    {name: "Digital Legends", image: "/placeholder.svg?height=300&width=300&query=Cyberpunk NFT collection 3", desc: "Legendary assets for collectors", price: "4.2 SUI"},
  ]
  const features = [
    {
      icon: Cpu,
      title: "Neural Trading",
      description: "AI-powered trading algorithms for optimal NFT transactions",
    },
    {
      icon: Network,
      title: "Quantum Network",
      description: "Connect with creators across the digital metaverse",
    },
    {
      icon: Shield,
      title: "Cyber Security",
      description: "Military-grade encryption protects your digital assets",
    },
    {
      icon: Database,
      title: "Data Matrix",
      description: "Advanced analytics and personalized recommendations",
    },
  ]

  const stats = [
    { label: "Total Volume", value: "2.5M SUI", glow: "cyan" },
    { label: "Active Users", value: "150K+", glow: "pink" },
    { label: "NFTs Listed", value: "500K+", glow: "purple" },
    { label: "Creators", value: "25K+", glow: "cyan" },
  ]

  return (
    <div className="min-h-screen cyber-grid scan-lines">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <Badge className="mb-6 neon-border-cyan bg-cyan-500/10 text-cyan-400 border-cyan-400/50">
              <Sparkles className="w-3 h-3 mr-1" />
              POWERED BY SUI BLOCKCHAIN
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="glitch-text neon-text-cyan" data-text="PUDEEZ">
                PUDEEZ
              </span>
              <span className="block mt-2">
                <span className="neon-text-pink">Market</span><span className="neon-text-purple">place</span>
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto font-mono">
              Enter the digital frontier. Trade, collect, and own unique assets in the cyberpunk metaverse. Your gateway
              to the future of digital ownership.
            </p>

            {/* Hero Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link to="/marketplace">
                <Button
                  size="lg"
                  className="w-full sm:w-auto neon-button-cyan px-8 py-4 text-lg font-semibold rounded-none font-mono uppercase tracking-wider transform hover:scale-105"
                >
                  <Gamepad2 className="w-6 h-6 mr-3" />
                  ENTER THE MATRIX
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
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
              <span className="neon-text-cyan">SYSTEM</span> <span className="neon-text-pink">FEATURES</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-mono">
              Advanced blockchain technology meets cyberpunk aesthetics
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

      {/* Featured Collections Preview */}
      <section className="py-20 bg-black/20 border-y border-purple-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">
              <span className="neon-text-purple">FEATURED</span> <span className="neon-text-cyan">COLLECTIONS</span>
            </h2>
            <p className="text-xl text-gray-300 font-mono">Discover trending assets from top creators</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCollections.map((item) => (
              <div
                key={item.name}
                className="cyber-card overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className="aspect-square bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 relative overflow-hidden border-b border-cyan-400/20">
                  <img
                    src={`/placeholder.svg?height=300&width=300&query=Cyberpunk NFT collection ${item}`}
                    alt={`Featured Collection ${item}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="neon-border-cyan bg-cyan-500/20 text-cyan-400">
                      <Star className="w-3 h-3 mr-1" />
                      FEATURED
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 font-mono neon-text-cyan">
                   {item.name}
                  </h3>
                  <p className="text-gray-400 mb-4 font-mono text-sm">{item.desc}</p>
                  <div className="flex justify-between items-center">
                    <span className="neon-text-pink font-mono font-bold">{item.price} SUI</span>
                    <Button size="sm" className="neon-button-purple font-mono uppercase text-xs">
                      ACCESS
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/marketplace">
              <Button size="lg" className="neon-button-cyan font-mono uppercase tracking-wider">
                EXPLORE ALL COLLECTIONS
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-mono">
            <span className="neon-text-cyan">READY TO</span> <span className="neon-text-pink">JACK IN?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 font-mono">
            Join the digital revolution. Connect your neural interface to the blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/wallet">
              <Button size="lg" className="neon-button-cyan font-mono uppercase tracking-wider">
                CONNECT NEURAL LINK
              </Button>
            </Link>
            <Button size="lg" className="neon-button-purple font-mono uppercase tracking-wider">
              SYSTEM INFO
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
