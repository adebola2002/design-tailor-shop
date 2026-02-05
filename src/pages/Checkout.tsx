 import { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { Layout } from '@/components/layout/Layout';
 import { SEO } from '@/components/SEO';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
 import { useCart } from '@/contexts/CartContext';
 import { useAuth } from '@/contexts/AuthContext';
 import { formatPrice, createOrder, createOrderItems } from '@/lib/supabase-helpers';
 import { useToast } from '@/hooks/use-toast';
 import { ShoppingBag, MapPin, Phone, Mail, User, Truck, Store, CreditCard, ArrowLeft, Check, Shield } from 'lucide-react';
 import { motion } from 'framer-motion';
 
 export default function Checkout() {
   const { items, totalAmount, clearCart } = useCart();
   const { user, profile } = useAuth();
   const navigate = useNavigate();
   const { toast } = useToast();
 
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
   const [formData, setFormData] = useState({
     fullName: profile?.full_name || '',
     email: profile?.email || user?.email || '',
     phone: profile?.phone_number || '',
     address: profile?.delivery_address || '',
     notes: '',
   });
 
   // Redirect to cart if empty
   if (items.length === 0) {
     return (
       <Layout>
         <div className="section-container py-20 text-center">
           <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground/50 mb-6" />
           <h1 className="font-display text-3xl font-bold mb-4">Your Cart is Empty</h1>
           <p className="text-muted-foreground mb-8">Add some items before checking out</p>
           <Button onClick={() => navigate('/shop')} size="lg">
             Continue Shopping
           </Button>
         </div>
       </Layout>
     );
   }
 
   // Redirect to auth if not logged in
   if (!user) {
     navigate('/auth');
     return null;
   }
 
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     const { name, value } = e.target;
     setFormData(prev => ({ ...prev, [name]: value }));
   };
 
   const validateForm = () => {
     if (!formData.fullName.trim()) {
       toast({ title: 'Error', description: 'Please enter your full name', variant: 'destructive' });
       return false;
     }
     if (!formData.phone.trim()) {
       toast({ title: 'Error', description: 'Please enter your phone number', variant: 'destructive' });
       return false;
     }
     if (deliveryMethod === 'delivery' && !formData.address.trim()) {
       toast({ title: 'Error', description: 'Please enter your delivery address', variant: 'destructive' });
       return false;
     }
     return true;
   };
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!validateForm()) return;
 
     setIsSubmitting(true);
     try {
       // Create order
       const order = await createOrder({
         user_id: user.id,
         order_type: 'product',
         total_amount: totalAmount,
         delivery_method: deliveryMethod,
         delivery_address: deliveryMethod === 'delivery' ? formData.address : null,
         delivery_contact: formData.phone,
         notes: formData.notes || undefined,
       });
 
       // Create order items
       await createOrderItems(items.map(item => ({
         order_id: order.id,
         product_id: item.product.id,
         quantity: item.quantity,
         size: item.size,
         price: item.product.price,
       })));
 
       // Clear cart
       clearCart();
 
       toast({
         title: 'Order Placed Successfully!',
         description: 'We will contact you shortly to confirm your order.',
       });
 
       navigate('/orders');
     } catch (error) {
       console.error('Error placing order:', error);
       toast({
         title: 'Error',
         description: 'Failed to place order. Please try again.',
         variant: 'destructive',
       });
     } finally {
       setIsSubmitting(false);
     }
   };
 
   const shippingFee = deliveryMethod === 'delivery' ? 3500 : 0;
   const grandTotal = totalAmount + shippingFee;
 
   return (
     <Layout>
       <SEO
         title="Checkout - Complete Your Order | Dowslakers"
         description="Complete your Dowslakers order. Secure checkout with multiple delivery options and payment methods."
         keywords="checkout, payment, order, delivery, secure payment"
         canonical="https://dowslakers.com/checkout"
       />
 
       <div className="section-container py-8">
         {/* Back Button */}
         <Button
           variant="ghost"
           onClick={() => navigate('/cart')}
           className="mb-6 gap-2"
         >
           <ArrowLeft className="h-4 w-4" />
           Back to Cart
         </Button>
 
         <div className="grid lg:grid-cols-3 gap-8">
           {/* Checkout Form */}
           <div className="lg:col-span-2 space-y-8">
             <div>
               <h1 className="font-display text-3xl font-bold mb-2">Checkout</h1>
               <p className="text-muted-foreground">Complete your order details below</p>
             </div>
 
             <form onSubmit={handleSubmit} className="space-y-8">
               {/* Contact Information */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="bg-card border rounded-xl p-6 space-y-4"
               >
                 <h2 className="text-lg font-medium flex items-center gap-2">
                   <User className="h-5 w-5 text-primary" />
                   Contact Information
                 </h2>
 
                 <div className="grid md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="fullName">Full Name *</Label>
                     <div className="relative">
                       <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <Input
                         id="fullName"
                         name="fullName"
                         value={formData.fullName}
                         onChange={handleInputChange}
                         placeholder="Your full name"
                         className="pl-10"
                       />
                     </div>
                   </div>
 
                   <div className="space-y-2">
                     <Label htmlFor="email">Email Address</Label>
                     <div className="relative">
                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <Input
                         id="email"
                         name="email"
                         type="email"
                         value={formData.email}
                         onChange={handleInputChange}
                         placeholder="your@email.com"
                         className="pl-10"
                       />
                     </div>
                   </div>
 
                   <div className="space-y-2 md:col-span-2">
                     <Label htmlFor="phone">Phone Number *</Label>
                     <div className="relative">
                       <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <Input
                         id="phone"
                         name="phone"
                         type="tel"
                         value={formData.phone}
                         onChange={handleInputChange}
                         placeholder="+234 800 000 0000"
                         className="pl-10"
                       />
                     </div>
                   </div>
                 </div>
               </motion.div>
 
               {/* Delivery Method */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="bg-card border rounded-xl p-6 space-y-4"
               >
                 <h2 className="text-lg font-medium flex items-center gap-2">
                   <Truck className="h-5 w-5 text-primary" />
                   Delivery Method
                 </h2>
 
                 <RadioGroup value={deliveryMethod} onValueChange={(v) => setDeliveryMethod(v as 'delivery' | 'pickup')}>
                   <div className="space-y-3">
                     <div
                       className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                         deliveryMethod === 'delivery'
                           ? 'border-primary bg-primary/5'
                           : 'border-border hover:border-muted-foreground'
                       }`}
                     >
                       <RadioGroupItem value="delivery" id="delivery" />
                       <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                         <div className="flex items-center gap-3">
                           <Truck className="h-5 w-5" />
                           <div>
                             <div className="font-medium">Home Delivery</div>
                             <div className="text-sm text-muted-foreground">
                               Delivered to your doorstep • {formatPrice(3500)}
                             </div>
                           </div>
                         </div>
                       </Label>
                     </div>
 
                     <div
                       className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                         deliveryMethod === 'pickup'
                           ? 'border-primary bg-primary/5'
                           : 'border-border hover:border-muted-foreground'
                       }`}
                     >
                       <RadioGroupItem value="pickup" id="pickup" />
                       <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                         <div className="flex items-center gap-3">
                           <Store className="h-5 w-5" />
                           <div>
                             <div className="font-medium">Store Pickup</div>
                             <div className="text-sm text-muted-foreground">
                               Pick up from our store • Free
                             </div>
                           </div>
                         </div>
                       </Label>
                     </div>
                   </div>
                 </RadioGroup>
 
                 {deliveryMethod === 'delivery' && (
                   <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     className="space-y-2 pt-4"
                   >
                     <Label htmlFor="address">Delivery Address *</Label>
                     <div className="relative">
                       <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                       <Textarea
                         id="address"
                         name="address"
                         value={formData.address}
                         onChange={handleInputChange}
                         placeholder="Enter your full delivery address"
                         className="pl-10 min-h-[80px]"
                       />
                     </div>
                   </motion.div>
                 )}
               </motion.div>
 
               {/* Order Notes */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="bg-card border rounded-xl p-6 space-y-4"
               >
                 <h2 className="text-lg font-medium">Order Notes (Optional)</h2>
                 <Textarea
                   name="notes"
                   value={formData.notes}
                   onChange={handleInputChange}
                   placeholder="Any special instructions for your order..."
                   className="min-h-[80px]"
                 />
               </motion.div>
 
               {/* Payment Info */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="bg-primary/5 border border-primary/20 rounded-xl p-6"
               >
                 <div className="flex items-start gap-4">
                   <div className="p-3 bg-primary/10 rounded-lg">
                     <CreditCard className="h-6 w-6 text-primary" />
                   </div>
                   <div>
                     <h3 className="font-medium mb-1">Payment on Confirmation</h3>
                     <p className="text-sm text-muted-foreground">
                       After placing your order, we will contact you to confirm the details and arrange payment via Paystack (cards, bank transfer, or USSD). Your order will be processed once payment is confirmed.
                     </p>
                   </div>
                 </div>
               </motion.div>
 
               {/* Submit Button (Mobile) */}
               <div className="lg:hidden">
                 <Button
                   type="submit"
                   disabled={isSubmitting}
                   className="w-full h-14 text-base gap-2"
                   size="lg"
                 >
                   {isSubmitting ? (
                     'Placing Order...'
                   ) : (
                     <>
                       <Check className="h-5 w-5" />
                       Place Order • {formatPrice(grandTotal)}
                     </>
                   )}
                 </Button>
               </div>
             </form>
           </div>
 
           {/* Order Summary */}
           <div className="lg:col-span-1">
             <div className="bg-card border rounded-xl p-6 sticky top-24 space-y-6">
               <h2 className="text-xl font-bold">Order Summary</h2>
 
               {/* Items */}
               <div className="space-y-4 max-h-[300px] overflow-y-auto">
                 {items.map((item) => (
                   <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                     <div className="w-16 h-20 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                       <img
                         src={item.product.images?.[0] || '/placeholder.svg'}
                         alt={item.product.name}
                         className="w-full h-full object-cover"
                       />
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                       <p className="text-xs text-muted-foreground">
                         Size: {item.size} × {item.quantity}
                       </p>
                       <p className="text-sm font-medium mt-1">
                         {formatPrice(item.product.price * item.quantity)}
                       </p>
                     </div>
                   </div>
                 ))}
               </div>
 
               <div className="border-t pt-4 space-y-3 text-sm">
                 <div className="flex justify-between">
                   <span className="text-muted-foreground">Subtotal</span>
                   <span>{formatPrice(totalAmount)}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-muted-foreground">Shipping</span>
                   <span>{shippingFee > 0 ? formatPrice(shippingFee) : 'Free'}</span>
                 </div>
               </div>
 
               <div className="border-t pt-4">
                 <div className="flex justify-between text-lg font-bold">
                   <span>Total</span>
                   <span>{formatPrice(grandTotal)}</span>
                 </div>
               </div>
 
               {/* Submit Button (Desktop) */}
               <div className="hidden lg:block">
                 <Button
                   type="submit"
                   form="checkout-form"
                   disabled={isSubmitting}
                   className="w-full h-12 gap-2"
                   size="lg"
                   onClick={handleSubmit}
                 >
                   {isSubmitting ? (
                     'Placing Order...'
                   ) : (
                     <>
                       <Check className="h-5 w-5" />
                       Place Order
                     </>
                   )}
                 </Button>
               </div>
 
               <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                 <Shield className="h-4 w-4" />
                 <span>Secure checkout</span>
               </div>
             </div>
           </div>
         </div>
       </div>
     </Layout>
   );
 }