import { useParams } from "react-router-dom";
import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useAddToCart } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Download, RotateCcw, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const CustomProduct = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug!);
  const { sessionId } = useCart();
  const addToCart = useAddToCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [printLocation, setPrintLocation] = useState<string>("front");
  const [uploadedDesign, setUploadedDesign] = useState<string | null>(null);
  const [designText, setDesignText] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#000000");
  const [fontSize, setFontSize] = useState<string>("medium");
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [quantity, setQuantity] = useState(1);
  const [rushOrder, setRushOrder] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedDesign(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!uploadedDesign && !designText) {
      toast.error("Please upload a design or add text");
      return;
    }

    const customOptions = {
      printLocation,
      uploadedDesign,
      designText,
      textColor,
      fontSize,
      fontFamily,
      rushOrder,
    };

    // Calculate price with customization fee
    const basePrice = product.base_price;
    const customizationFee = 10;
    const rushFee = rushOrder ? 15 : 0;
    const totalPrice = basePrice + customizationFee + rushFee;

    try {
      await addToCart.mutateAsync({
        productId: product.id,
        sessionId,
        quantity,
        selectedColor,
        selectedSize,
        customOptions,
        price: totalPrice,
      });

      toast.success("Custom product added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const resetCustomization = () => {
    setUploadedDesign(null);
    setDesignText("");
    setTextColor("#000000");
    setFontSize("medium");
    setFontFamily("Arial");
    setPrintLocation("front");
    setRushOrder(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="w-full h-96" />
            <Skeleton className="w-full h-96" />
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The product you're trying to customize doesn't exist.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const basePrice = product.base_price;
  const customizationFee = 10;
  const rushFee = rushOrder ? 15 : 0;
  const totalPrice = basePrice + customizationFee + rushFee;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Customize Your {product.name}</h1>
          <p className="text-muted-foreground">
            Create your unique design and make it your own
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <img
                  src={product.images?.[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg mb-4"
                />
                
                {/* Design Overlay */}
                {(uploadedDesign || designText) && (
                  <div className={`absolute inset-0 flex items-center justify-center ${
                    printLocation === 'front' ? 'translate-y-0' : 'translate-y-8'
                  }`}>
                    {uploadedDesign ? (
                      <img
                        src={uploadedDesign}
                        alt="Custom design"
                        className="max-w-32 max-h-32 object-contain"
                      />
                    ) : designText ? (
                      <div 
                        className={`text-center font-${fontFamily.toLowerCase()} ${
                          fontSize === 'small' ? 'text-sm' : 
                          fontSize === 'large' ? 'text-xl' : 'text-base'
                        }`}
                        style={{ color: textColor }}
                      >
                        {designText}
                      </div>
                    ) : null}
                  </div>
                )}
                
                <div className="flex gap-2 mb-4">
                  <Badge 
                    variant={printLocation === 'front' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setPrintLocation('front')}
                  >
                    Front
                  </Badge>
                  <Badge 
                    variant={printLocation === 'back' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setPrintLocation('back')}
                  >
                    Back
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customization Options */}
          <div className="space-y-6">
            {/* Product Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Product Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Colors */}
                <div>
                  <Label>Color</Label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.colors?.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sizes */}
                <div>
                  <Label>Size</Label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes?.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Design Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Design</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image Design
                  </Button>
                </div>

                {uploadedDesign && (
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <img src={uploadedDesign} alt="Uploaded design" className="w-12 h-12 object-cover rounded" />
                    <span className="text-sm">Design uploaded successfully</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setUploadedDesign(null)}
                    >
                      Remove
                    </Button>
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Text Design */}
            <Card>
              <CardHeader>
                <CardTitle>Add Text Design</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Text</Label>
                  <Input
                    placeholder="Enter your text here..."
                    value={designText}
                    onChange={(e) => setDesignText(e.target.value)}
                  />
                </div>

                {designText && (
                  <>
                    <div>
                      <Label>Text Color</Label>
                      <Input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-20 h-10"
                      />
                    </div>

                    <div>
                      <Label>Font Size</Label>
                      <RadioGroup value={fontSize} onValueChange={setFontSize}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="small" id="small" />
                          <Label htmlFor="small">Small</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium">Medium</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="large" id="large" />
                          <Label htmlFor="large">Large</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label>Font Family</Label>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Helvetica">Helvetica</SelectItem>
                          <SelectItem value="Times">Times New Roman</SelectItem>
                          <SelectItem value="Impact">Impact</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Additional Options */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Quantity</Label>
                  <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number(value))}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rush-order"
                    checked={rushOrder}
                    onCheckedChange={(checked) => setRushOrder(checked === true)}
                  />
                  <Label htmlFor="rush-order">Rush Order (+$15)</Label>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Actions */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>${basePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customization Fee:</span>
                    <span>+$10</span>
                  </div>
                  {rushOrder && (
                    <div className="flex justify-between">
                      <span>Rush Order:</span>
                      <span>+$15</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={addToCart.isPending}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add Custom Product to Cart
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={resetCustomization}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Customization
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CustomProduct;