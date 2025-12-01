import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function EducationalContent() {
  const recyclingImage = PlaceHolderImages.find(img => img.id === 'recycling-bins');
  const compostImage = PlaceHolderImages.find(img => img.id === 'compost-pile');
  const productsImage = PlaceHolderImages.find(img => img.id === 'recycled-products');

  return (
    <section className="mt-16 md:mt-24">
      <h2 className="text-3xl font-bold text-center mb-8 font-headline">Learn More About WasteWise Living</h2>
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardContent className="p-0">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="px-6 text-lg hover:no-underline font-semibold">Why is Waste Segregation Important?</AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4 text-muted-foreground">
                  {recyclingImage && (
                    <div className="float-right ml-6 mb-4 w-full sm:w-1/2 max-w-[300px]">
                      <Image
                        src={recyclingImage.imageUrl}
                        alt={recyclingImage.description}
                        width={600}
                        height={400}
                        className="rounded-lg shadow-md"
                        data-ai-hint={recyclingImage.imageHint}
                      />
                    </div>
                  )}
                  <p>
                    Proper waste segregation is crucial for environmental protection and resource conservation. When we separate our waste into categories like recyclable, compostable, and non-recyclable, we enable efficient processing.
                  </p>
                  <p>
                    Recycling materials like plastic, glass, and paper reduces the need for raw materials, saves energy, and cuts down on greenhouse gas emissions. Composting organic waste creates nutrient-rich soil, reducing the need for chemical fertilizers and decreasing the amount of waste in landfills, which are a major source of methane gas.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="px-6 text-lg hover:no-underline font-semibold">Understanding Waste Categories</AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4 text-muted-foreground">
                  {compostImage && (
                      <div className="float-left mr-6 mb-4 w-full sm:w-1/2 max-w-[300px]">
                        <Image
                          src={compostImage.imageUrl}
                          alt={compostImage.description}
                          width={600}
                          height={400}
                          className="rounded-lg shadow-md"
                          data-ai-hint={compostImage.imageHint}
                        />
                      </div>
                    )}
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong className="text-foreground">Recyclables:</strong> Items that can be reprocessed into new products. Includes most paper, cardboard, glass bottles, plastic containers, and metal cans.</li>
                    <li><strong className="text-foreground">Organics (Compostable):</strong> Food scraps, coffee grounds, eggshells, and yard waste like leaves and grass clippings.</li>
                    <li><strong className="text-foreground">General Waste:</strong> Items that cannot be recycled or composted, such as plastic films, broken ceramics, and mixed-material products.</li>
                    <li><strong className="text-foreground">Hazardous Waste:</strong> Batteries, electronics, and chemicals that require special disposal.</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-b-0">
              <AccordionTrigger className="px-6 text-lg hover:no-underline font-semibold">Tips for Effective Recycling</AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4 text-muted-foreground">
                  {productsImage && (
                    <div className="float-right ml-6 mb-4 w-full sm:w-1/2 max-w-[300px]">
                      <Image
                        src={productsImage.imageUrl}
                        alt={productsImage.description}
                        width={600}
                        height={400}
                        className="rounded-lg shadow-md"
                        data-ai-hint={productsImage.imageHint}
                      />
                    </div>
                  )}
                  <ol className="list-decimal pl-5 space-y-2">
                    <li><strong className="text-foreground">Clean & Dry:</strong> Always rinse food and drink containers before recycling. Wet or greasy paper cannot be recycled.</li>
                    <li><strong className="text-foreground">Know Your Plastics:</strong> Look for the recycling symbol with a number inside. Check with your local facility to see which numbers they accept.</li>
                    <li><strong className="text-foreground">No "Wishcycling":</strong> When in doubt, throw it out. Adding non-recyclable items to your recycling bin can contaminate the entire batch.</li>
                    <li><strong className="text-foreground">Flatten Boxes:</strong> Save space in your bin and at the recycling facility by flattening cardboard boxes.</li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}
