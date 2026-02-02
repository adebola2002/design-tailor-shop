import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const agbadaSizes = [
  { size: 'S', chest: '38-40"', length: '58"', shoulder: '18"' },
  { size: 'M', chest: '40-42"', length: '60"', shoulder: '19"' },
  { size: 'L', chest: '42-44"', length: '62"', shoulder: '20"' },
  { size: 'XL', chest: '44-46"', length: '64"', shoulder: '21"' },
  { size: 'XXL', chest: '46-48"', length: '66"', shoulder: '22"' },
];

const kaftanSizes = [
  { size: 'S', chest: '38-40"', length: '42"', shoulder: '18"' },
  { size: 'M', chest: '40-42"', length: '44"', shoulder: '19"' },
  { size: 'L', chest: '42-44"', length: '46"', shoulder: '20"' },
  { size: 'XL', chest: '44-46"', length: '48"', shoulder: '21"' },
  { size: 'XXL', chest: '46-48"', length: '50"', shoulder: '22"' },
];

const measurementGuide = [
  { name: 'Chest', description: 'Measure around the fullest part of your chest, keeping the tape horizontal.' },
  { name: 'Shoulder', description: 'Measure from the edge of one shoulder to the other across your back.' },
  { name: 'Length', description: 'Measure from the highest point of your shoulder to your desired length.' },
  { name: 'Arm Length', description: 'Measure from your shoulder point to your wrist with arm slightly bent.' },
  { name: 'Neck', description: 'Measure around the base of your neck where a collar would sit.' },
];

export default function SizeGuide() {
  return (
    <Layout>
      <SEO
        title="Size Guide"
        description="Find your perfect fit with our comprehensive size guide for agbada, kaftan, and other styles. Detailed measurements for all sizes."
        keywords="size guide, measurements, agbada sizes, kaftan sizes, clothing fit"
        canonical="https://dowslakers.com/size-guide"
      />
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary/30">
        <div className="section-container text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Find Your Perfect Fit
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-light">
            Size Guide
          </h1>
        </div>
      </section>

      {/* Size Charts */}
      <section className="py-16 lg:py-24">
        <div className="section-container max-w-4xl">
          <Tabs defaultValue="agbada" className="w-full">
            <TabsList className="w-full justify-center mb-12 bg-transparent gap-8">
              <TabsTrigger 
                value="agbada" 
                className="text-xs tracking-[0.15em] uppercase data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-foreground rounded-none px-0 pb-2"
              >
                Agbada
              </TabsTrigger>
              <TabsTrigger 
                value="kaftan"
                className="text-xs tracking-[0.15em] uppercase data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-foreground rounded-none px-0 pb-2"
              >
                Kaftan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="agbada">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 text-xs tracking-[0.15em] uppercase text-muted-foreground">Size</th>
                      <th className="text-left py-4 text-xs tracking-[0.15em] uppercase text-muted-foreground">Chest</th>
                      <th className="text-left py-4 text-xs tracking-[0.15em] uppercase text-muted-foreground">Length</th>
                      <th className="text-left py-4 text-xs tracking-[0.15em] uppercase text-muted-foreground">Shoulder</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agbadaSizes.map((item) => (
                      <tr key={item.size} className="border-b border-border/50">
                        <td className="py-4 font-medium">{item.size}</td>
                        <td className="py-4 text-muted-foreground">{item.chest}</td>
                        <td className="py-4 text-muted-foreground">{item.length}</td>
                        <td className="py-4 text-muted-foreground">{item.shoulder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="kaftan">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 text-xs tracking-[0.15em] uppercase text-muted-foreground">Size</th>
                      <th className="text-left py-4 text-xs tracking-[0.15em] uppercase text-muted-foreground">Chest</th>
                      <th className="text-left py-4 text-xs tracking-[0.15em] uppercase text-muted-foreground">Length</th>
                      <th className="text-left py-4 text-xs tracking-[0.15em] uppercase text-muted-foreground">Shoulder</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kaftanSizes.map((item) => (
                      <tr key={item.size} className="border-b border-border/50">
                        <td className="py-4 font-medium">{item.size}</td>
                        <td className="py-4 text-muted-foreground">{item.chest}</td>
                        <td className="py-4 text-muted-foreground">{item.length}</td>
                        <td className="py-4 text-muted-foreground">{item.shoulder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* How to Measure */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="section-container max-w-4xl">
          <h2 className="font-display text-3xl font-light text-center mb-12">
            How to Measure
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {measurementGuide.map((item) => (
              <div key={item.name} className="p-6 bg-background">
                <h3 className="font-medium mb-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-background text-center">
            <h3 className="font-medium mb-4">Need Help?</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Our expert tailors are here to assist you with measurements. 
              For custom orders, we recommend our Made-to-Measure service.
            </p>
            <a 
              href="/contact" 
              className="text-sm tracking-wide border-b border-foreground pb-0.5 hover:opacity-60 transition-opacity"
            >
              Contact Our Team
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
