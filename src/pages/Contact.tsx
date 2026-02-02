import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll respond within 24 hours.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      <SEO
        title="Contact Us - Dowslakers Customer Support"
        description="Contact Dowslakers for custom orders, product inquiries, or customer support. Get in touch via email, phone, or contact form for premium African fashion assistance."
        keywords="contact Dowslakers, customer service, support, inquiries, custom order help, African fashion support, tailoring questions"
        canonical="https://dowslakers.com/contact"
      />
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary/30">
        <div className="section-container text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Get In Touch
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-light">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="font-display text-2xl font-light mb-8">
                We'd Love to Hear From You
              </h2>
              <p className="text-muted-foreground mb-12">
                Whether you have questions about our collections, need styling advice, 
                or want to discuss a custom order, our team is here to help.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <MapPin className="h-5 w-5 mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="font-medium mb-1">Visit Our Atelier</h3>
                    <p className="text-sm text-muted-foreground">
                      123 Fashion Avenue<br />
                      Victoria Island, Lagos<br />
                      Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone className="h-5 w-5 mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="font-medium mb-1">Call Us</h3>
                    <p className="text-sm text-muted-foreground">
                      +234 123 456 7890
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Mail className="h-5 w-5 mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-sm text-muted-foreground">
                      hello@dowslakers.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="h-5 w-5 mt-1 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <h3 className="font-medium mb-1">Opening Hours</h3>
                    <p className="text-sm text-muted-foreground">
                      Monday - Saturday: 10am - 7pm<br />
                      Sunday: By Appointment Only
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-secondary/30 p-8 lg:p-12">
              <h3 className="font-display text-xl font-light mb-8">
                Send a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">
                      First Name
                    </label>
                    <Input 
                      name="firstName" 
                      required 
                      className="bg-background border-border/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">
                      Last Name
                    </label>
                    <Input 
                      name="lastName" 
                      required 
                      className="bg-background border-border/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">
                    Email
                  </label>
                  <Input 
                    type="email" 
                    name="email" 
                    required 
                    className="bg-background border-border/50"
                  />
                </div>

                <div>
                  <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">
                    Phone (Optional)
                  </label>
                  <Input 
                    type="tel" 
                    name="phone" 
                    className="bg-background border-border/50"
                  />
                </div>

                <div>
                  <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2 block">
                    Message
                  </label>
                  <Textarea 
                    name="message" 
                    rows={5} 
                    required 
                    className="bg-background border-border/50 resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
