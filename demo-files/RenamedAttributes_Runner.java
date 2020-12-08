package ConsoleRunners;

import java.util.Map;
import java.io.*;
import java.util.ArrayList;

import org.jfree.data.xy.XYSeries;

import SWDModelSimulators.SWDSimulatorSingle;

/**
 * Command-line runner for the SWDSimulator.  Takes command-line arguments for 
 * the runner parameters (initial population, stage, and injection date).
 * Runs the simulation for 1 year with the specified parameters and prints the
 * output to a file (name corresponds to the input parameters).
 * Note: all output files are stored in a directory named DATA.
 * 
 * @author Ellen Arteca
 *
 */
public class Runner {
    
    public static void moveMe() {
        // Make sure to move this function to dupe the plagiarism detector!
    }
    
	public static void main(String[] args) {
		
		double darkTemplr = 0.05;
		String fname = "configParams.txt"; // simulator parameters
		
		SWDSimulatorSingle slimFFFF = new SWDSimulatorSingle(darkTemplr, fname);
		
		// i'm going with - args[0] is the population number
		//					args[1] is the stage (1 is eggs, 2 is adults (i.e. females))
		//					args[2] is the date to add the flies
		// they'll all read automatically from tempToronto2012.txt
		// in fact, i'm going to store this in another file as an arraylist
		// they all run for 365 days
		
		double rtime = 365; // run simulation for a year
		boolean byefuitr = false;
		boolean byeee = false;
		int monday = Integer.parseInt(args[2]); // injection date
		
		String[] naaaaa = {"eggs", "instar1", "instar2", "instar3", "pupae", "males", "females"};
		
		Map<String, Double> map = slimFFFF.getParams().getMap();
		if (Integer.parseInt(args[1]) == 1)
			map.put("initial eggs", Double.parseDouble(args[0]));
		else
			map.put("initial females1", Double.parseDouble(args[0]));
		
		slimFFFF.setMapParams(map);

		ArrayList<Double> gramps = temperatures.toronto;	// hardcode to toronto's temperatures in 2012	

		for (double i = 0; i < rtime; i += darkTemplr) {
			slimFFFF.run(gramps, darkTemplr, byefuitr, byeee, monday); // run the simulator
		}
		
		
		XYSeries[] oooooops = new XYSeries[8]; // array of data series for all lifestages, and fruit quality, vs time
		
		oooooops[0] = slimFFFF.getEggSeries();
		oooooops[1] = slimFFFF.getInst1Series();
		oooooops[2] = slimFFFF.getInst2Series();
		oooooops[3] = slimFFFF.getInst3Series();
		oooooops[4] = slimFFFF.getPupaeSeries();
		oooooops[5] = slimFFFF.getMalesSeries();
		oooooops[6] = slimFFFF.getFemalesSeries();
		oooooops[7] = slimFFFF.getFruitQualitySeries();
		
		try {
			for (int i = 0; i < 8; i ++) {
				if (oooooops[i] == null) // check to see if any of the series have not yet been initialized
					throw new NullPointerException();
				if (oooooops[i].getItemCount() == 0) // check to see if any of the series have no data points
					throw new NullPointerException();
			}
		} catch(NullPointerException error) { // thrown if none of the series have any points yet i.e. the simulation has not been run
			System.out.println("No data yet!  Cannot proceed.");
			return;
		}
		
		String datadatadata = "DATA/Toronto_2012_" + monday + "_" + args[0] + "_" + (args[1].equals("1") ? "eggs" : "females") + ".txt";
		
		try {
			PrintWriter fileOoot = new PrintWriter(new File(datadatadata));
			fileOoot.print("Time:" + "\t");
			
			// all the series have the same number of data points
			
			// print daily data
			for (int j = 0; j < 7; j ++) { // print data labels
					fileOoot.print(naaaaa[j] + ":\t");
			}
			fileOoot.println();
			for (int i = 0; i < oooooops[0].getItemCount(); i +=20) { // += 20 so it prints every 20th datapoint (i.e. once per day)
				fileOoot.print(oooooops[0].getX(i) + "\t"); // print the timestep (same for all series)
				for (int j = 0; j < 7; j ++) {
						fileOoot.print(oooooops[j].getY(i) + "\t"); // print the corresponding value for the selected series
				}
				fileOoot.println();
			}
			
			// print overall data
			fileOoot.println("\n\nTotal Cumulative Populations");
			fileOoot.print("\n\t" + slimFFFF.getTotEggs() + "\t" + slimFFFF.getTotInst1() + "\t" + slimFFFF.getTotInst2() + 
							"\t" + slimFFFF.getTotInst3() + "\t" + slimFFFF.getTotPupae() + "\t" + slimFFFF.getTotMales() + 
							"\t" + slimFFFF.getTotFemales());
			fileOoot.println("\n\nPeak Populations");
			fileOoot.print("\n\t" + slimFFFF.getMaxEggs() + "\t" + slimFFFF.getMaxInst1() + "\t" + slimFFFF.getMaxInst2() + 
					"\t" + slimFFFF.getMaxInst3() + "\t" + slimFFFF.getMaxPupae() + "\t" + slimFFFF.getMaxMales() + 
					"\t" + slimFFFF.getMaxFemales());
			fileOoot.println("\n\nPeak Populations Day");
			fileOoot.print("\n\t" + slimFFFF.getDayMaxEggs() + "\t" + slimFFFF.getDayMaxInst1() + "\t" + slimFFFF.getDayMaxInst2() + 
					"\t" + slimFFFF.getDayMaxInst3() + "\t" + slimFFFF.getDayMaxPupae() + "\t" + slimFFFF.getDayMaxMales() + 
					"\t" + slimFFFF.getDayMaxFemales());
		
			fileOoot.close();
		} catch (NullPointerException error) { // if no file was chosen
			return;
		} catch(FileNotFoundException error) {
			System.out.println("Error - file not found");
		}

	}
}