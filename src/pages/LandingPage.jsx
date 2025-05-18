import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, CalendarDays, Edit } from "lucide-react";

const LandingPage = () => {
  const fadeInAnimation = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: "easeOut", delay },
  });

  const testimonials = [
    {
      name: "Alex P.",
      quote:
        "TripCraft made planning my Euro trip a breeze! So intuitive and visually appealing.",
      avatarSeed: "Alex",
    },
    {
      name: "Sarah K.",
      quote:
        "I love how I can easily reorder days and activities. Best travel planner I've used.",
      avatarSeed: "Sarah",
    },
    {
      name: "Mike L.",
      quote:
        "The flexibility to add notes and times for each activity is fantastic. Highly recommend!",
      avatarSeed: "Mike",
    },
  ];

  const features = [
    {
      icon: <MapPin className="h-10 w-10 text-secondary" />,
      title: "Organize Destinations",
      description:
        "Easily plan your trip day-by-day, city-by-city. Keep all your locations in one place.",
    },
    {
      icon: <CalendarDays className="h-10 w-10 text-secondary" />,
      title: "Schedule Activities",
      description:
        "Add activities, set times, and jot down notes. Never miss an important detail.",
    },
    {
      icon: <Edit className="h-10 w-10 text-secondary" />,
      title: "Flexible Planning",
      description:
        "Drag and drop to reorder days or activities. Your plans adapt as quickly as you do.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/30 text-foreground selection:bg-secondary selection:text-secondary-foreground">
      <main className="flex-grow">
        <section className="relative flex flex-col items-center justify-center text-center py-24 md:py-32 px-4 min-h-[70vh] overflow-hidden">
          <div className="absolute inset-0 -z-20">
            <img
              alt="Breathtaking panoramic view of a sun-kissed mountain range with a winding road"
              className="w-full h-full object-cover opacity-50"
              src="https://images.unsplash.com/photo-1674840690385-520922dbd526"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/80 to-background"></div>
          </div>

          <motion.div
            variants={fadeInAnimation(0.1)}
            initial="initial"
            animate="animate"
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-6">
              Plan smarter. Travel better.
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-10">
              Create flexible, beautiful travel plans with ease. TripCraft helps
              you organize your adventures seamlessly.
            </p>
            <Link to="/planner">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xl px-10 py-7 rounded-lg shadow-xl hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Build Your Itinerary
              </Button>
            </Link>
          </motion.div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-6">
            <motion.h2
              className="text-4xl font-serif font-bold text-center text-primary mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              Why Choose TripCraft?
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeInAnimation(index * 0.2)}
                  className="text-center p-6"
                >
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-secondary/10 rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-6">
            <motion.h2
              className="text-4xl font-serif font-bold text-center text-primary mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              What Our Travelers Say
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeInAnimation(index * 0.15)}
                >
                  <Card className="glassmorphism-card rounded-xl h-full flex flex-col p-2">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-2xl font-bold text-secondary-foreground shadow-md">
                          {testimonial.avatarSeed.substring(0, 1)}
                        </div>
                        <CardTitle className="text-xl text-primary">
                          {testimonial.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow pt-0">
                      <p className="text-foreground/80 italic leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 bg-foreground text-center">
        <p className="text-background/70">
          &copy; {new Date().getFullYear()} TripCraft. All rights reserved.
        </p>
        <p className="text-background/50 text-sm mt-1">
          Your Interactive Itinerary Companion
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
