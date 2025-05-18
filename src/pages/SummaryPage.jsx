import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useItinerary } from '@/contexts/ItineraryContext';
import { ArrowLeft, Download, Printer, Map as MapTrifold, Backpack } from 'lucide-react';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';

const SummaryPage = () => {
  const { days, itineraryTitle } = useItinerary();
  const [isExporting, setIsExporting] = React.useState(false);

  const exportToPdf = () => {
    setIsExporting(true);
    const summaryElement = document.getElementById('itinerary-summary-content');
    if (!summaryElement) {
      setIsExporting(false);
      return;
    }
    
    const options = {
      margin:       [0.75, 0.5, 0.75, 0.5], // Increased top/bottom margin
      filename:     `${itineraryTitle.replace(/\s+/g, '_') || 'itinerary_summary'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false, scrollY: -window.scrollY },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(summaryElement).set(options).save().then(() => {
      setIsExporting(false);
    }).catch(err => {
      console.error("Error exporting PDF:", err);
      setIsExporting(false);
    });
  };
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4 md:p-8 selection:bg-secondary selection:text-secondary-foreground">
      <div id="itinerary-summary-content" className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3"
          >
            {itineraryTitle} - Trip Summary
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="text-xl text-muted-foreground"
          >
            A bird's-eye view of your upcoming adventure!
          </motion.p>
        </header>

        {days.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-muted-foreground py-16 bg-card/70 backdrop-blur-sm rounded-xl shadow-lg p-8"
          >
            <Backpack size={72} className="mx-auto mb-6 text-primary/40" />
            <p className="text-3xl font-serif text-primary mb-3">Your Itinerary is Empty</p>
            <p className="text-lg mb-6">Looks like your travel bag is still unpacked! Head back to the planner to fill it with exciting days and activities.</p>
            <img   
              className="mx-auto mt-8 w-full max-w-sm h-auto object-contain opacity-80 rounded-lg" 
              alt="Stylized illustration of an empty, open vintage suitcase"
             src="https://images.unsplash.com/photo-1563820510191-3b4a20c78568" />
          </motion.div>
        ) : (
          <div className="space-y-8">
            {days.map((day, index) => (
              <motion.div
                key={day.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              >
                <Card className="bg-card/80 backdrop-blur-sm shadow-xl rounded-xl border-primary/20 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/70 via-primary/60 to-secondary/60 p-5">
                    <CardTitle className="text-2xl font-serif font-semibold text-primary-foreground">{day.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 md:p-6">
                    {day.activities.length > 0 ? (
                      <ul className="space-y-3">
                        {day.activities.map((activity) => (
                          <li key={activity.id} className="p-3 bg-background/70 rounded-lg border border-border transition-all hover:border-primary/50 hover:shadow-sm">
                            <p className="font-semibold text-primary text-lg">{activity.name}</p>
                            {activity.time && <p className="text-sm text-muted-foreground">Scheduled for: {activity.time}</p>}
                            {activity.notes && <p className="text-sm text-foreground/80 mt-1 italic">Notes: {activity.notes}</p>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-md text-muted-foreground italic text-center py-3">No activities planned for this day. A day of rest, perhaps?</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: days.length * 0.1 + 0.3, ease: "easeOut" }}
        className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-4 print:hidden"
      >
        <Link to="/planner">
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 h-12 text-lg shadow-md hover:shadow-primary/20">
            <ArrowLeft className="mr-2 h-5 w-5" /> Return to Planner
          </Button>
        </Link>
        <Button 
            size="lg" 
            onClick={exportToPdf} 
            className="bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-lg shadow-lg hover:shadow-accent/40"
            disabled={isExporting || days.length === 0}
        >
          <Download className="mr-2 h-5 w-5" /> 
          {isExporting ? 'Downloading...' : 'Download PDF'}
        </Button>
         <Button 
            size="lg" 
            variant="outline"
            onClick={handlePrint} 
            className="border-muted-foreground text-muted-foreground hover:bg-muted/30 h-12 text-lg shadow-md hover:shadow-muted-foreground/20"
            disabled={days.length === 0}
        >
          <Printer className="mr-2 h-5 w-5" /> 
          Print Itinerary
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: days.length * 0.1 + 0.5 }}
        className="mt-12 text-center print:hidden"
      >
         <Card className="max-w-md mx-auto bg-card/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow rounded-xl border-primary/10">
            <CardHeader className="items-center">
                <MapTrifold size={40} className="text-primary mb-2" />
                <CardTitle className="text-xl text-primary">Your Journey Map</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
                <img   
                    className="w-full h-48 object-cover rounded-lg shadow-md" 
                    alt="Beautifully illustrated fantasy map showing a travel route with landmarks"
                 src="https://images.unsplash.com/photo-1585854191429-49f8ffffc36d" />
                <CardDescription className="mt-3 text-sm text-muted-foreground">
                    Visualize your adventure! (This is a placeholder for a future interactive map feature).
                </CardDescription>
            </CardContent>
         </Card>
      </motion.div>
      
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: days.length * 0.1 + 0.7 }}
        className="py-10 mt-12 text-center text-sm text-muted-foreground print:hidden"
      >
        <p>&copy; {new Date().getFullYear()} TripCraft. Adventure Awaits!</p>
      </motion.footer>

      {isExporting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] print:hidden"
        >
          <div className="bg-card p-8 rounded-xl shadow-2xl text-center">
             <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.1, 1]}}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="mx-auto mb-4"
            >
              <Download size={48} className="text-accent" />
            </motion.div>
            <p className="text-xl font-semibold text-primary">Preparing Your PDF...</p>
            <p className="text-muted-foreground">Hold tight, your itinerary is being packaged.</p>
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default SummaryPage;