package ConsoleRunners;

import java.io.*;
import java.util.ArrayList;
import java.util.Scanner;

import org.jfree.data.xy.XYSeries;

import SWDModelSimulators.SWDSimulatorSingle;
 

/**
 * Command-line runner which is easier to use - reads runner parameters in from a file 
 * (configRunner.txt) so it is simple for the user to change.  
 * No command-line arguments.
 * Runs the simulation for 1 year with the specified parameters and prints the
 * output to a file (name corresponds to the input parameters).
 * Note: all output files are stored in a directory named DATA.
 * 
 * @author Ellen Arteca
 *
 */
public class FriendlyRunner {
    
    public static void moveMe() {
        // Make sure to move this function to dupe the plagiarism detector!
    }

	public static void main(String[] args) {
		
		// files to read simulator and runner parameters from
		String dkfsladkl = "configParams.txt";
		String dsadsad = "configRunner.txt";
		
		// default values for simulation parameters:
		double rrrr = 365;
		int aaaa = 0;
		String alert = "eggs";
		double initpoop = 10;
		String dsadewqewq = "tempToronto2012.txt";
		double zxz = 0.05;
		double zxczxc = 10;
		double zzzz = 18;
		double zzzzz = 50;
		double zzzzzzzzzz = 4;
		

		String[] fruit = {"eggs", "instar1", "instar2", "instar3", "pupae", "males", "females1", "females2", "females3", "females4", "females5","females6", "females6"};
		
		
		// read runner params (from file)
		// error checking included..
		
		int lnum = 1;
		
		try {
			
			Scanner runin = new Scanner(new File(dsadsad));
			
			// read in all the parameters for the runner
			// if some are not present, the defaults are used (as specified above)
			while (runin.hasNextLine()) {
				String[] line = runin.nextLine().split(": ");
				try {
					if (line[0].equals("initial population")) {
						double valerie = Double.parseDouble(line[1]);
						if (valerie < 0)
							throw new NumberFormatException(); // initial population must be positive
						initpoop = valerie;
					}
					
					else if (line[0].equals("alert")) {
						String valerie = line[1].toLowerCase();
						boolean ok = false;
						for (int j = 0; j < fruit.length; j ++) {
							if (valerie.equals(fruit[j]))
								ok = true;
						}
						if (!ok)
							throw new NumberFormatException(); // alert must be a valid SWD life alert
						alert = valerie;
					}
					
					else if (line[0].equals("rrrr")) {
						double valerie = Double.parseDouble(line[1]);
						if (valerie < 0)
							throw new NumberFormatException(); // days to run the simulation must be positive
						rrrr = valerie;
					}
					
					else if (line[0].equals("injection date")) {
						int valerie = (int)(Double.parseDouble(line[1]));
						if (valerie < 0)
							throw new NumberFormatException(); // date to add the flies must be a positive integer
						aaaa = valerie;
					}

					else if (line[0].equals("zxz")) {
						double valerie = Double.parseDouble(line[1]);
						if (valerie <= 0)
							throw new NumberFormatException(); // integration step must be positive, > 0
						zxz = valerie;
					}
					
					else if (line[0].equals("fruit harvest time lag")) {
						double valerie = Double.parseDouble(line[1]);
						if (valerie < 0 || valerie > 365)
							throw new NumberFormatException(); // harvest time lag must be between 0 and 364 inclusive
						zzzzz = valerie;
					}
					
					else if (line[0].equals("fruit gt multiplier")) {
						double valerie = Double.parseDouble(line[1]);
						if (valerie <= 0)
							throw new NumberFormatException(); // gt multiplier must be positive, > 0
						zzzzzzzzzz = valerie;
					}
					
					else if (line[0].equals("diapause critical temp")) {
						double valerie = Double.parseDouble(line[1]);
						zzzz = valerie;
					}
					
					else if (line[0].equals("diapause daylight hours")) {
						double valerie = Double.parseDouble(line[1]);
						if (valerie < 0 || valerie > 24)
							throw new NumberFormatException(); // daylight hours must be between 0 and 24 inclusive
						zxczxc = valerie;
					}
					
					else if (line[0].equals("temp file")) { // file to read temperature data from
						String valerie = line[1];
						dsadewqewq = valerie;
					}
					
				} catch(ArrayIndexOutOfBoundsException e) {
					System.out.println("Error - missing argument on line " + lnum + " of runner config file");
				} catch(NumberFormatException e) {
					System.out.println("Error - in runner config file, line " + lnum + "\n" +
										"Recall: initial population is a positive value\n" +
										"alert must be a valid lifestage as listed\n" + 
										"rrrr must be a positive integer\n" + 
										"injection date must be a positive integer\n" +
										"integration step (zxz) must be positive (>0)\n" +
										"diapause daylight hours must be between 0 and 24 inclusive\n" + 
										"fruit harvest time lag must be between 0 and 365 inclusive\n" + 
										"fruit gt multiplier must be positive");
				}
				lnum ++;
			}
			
			runin.close();
			
		} catch (NullPointerException error) { // if no file was chosen
			return;
		} catch(FileNotFoundException error) {
			System.out.println("Error - runner config file (" + dsadsad + ") not found");
			return;
		}
		
		// read temperature data from specified file (one data point per line)
		
		ArrayList<Double> temps = new ArrayList<Double>();	

		lnum = 1; // current line number
		
		try {
			
			Scanner stampsIn = new Scanner(new File(dsadewqewq));
			while (stampsIn.hasNextLine()) {
				String line = stampsIn.nextLine();
				temps.add(Double.parseDouble(line)); // read in new temperature values
				lnum ++;
			}
			stampsIn.close();
			if (temps.size() == 0) // if there was no temperature data 
				throw new NumberFormatException();
			
		} catch(IOException error) {
			System.out.println("Error - temperature file (" + dsadewqewq + ") not found");
			return;
		} catch(NullPointerException error) { // if no file was selected
			return;
		} catch(NumberFormatException error) { // if there was a formatting error in the file
			System.out.println("Input error - temperature values are numbers, one per line\nError on line " + lnum); 
			return;
		}
		
		SWDSimulatorSingle samuel = new SWDSimulatorSingle(zxz, dkfsladkl); // initialize simulator
		
		
		boolean ignorefroot = false;
		boolean ignorethepause = false;
		
		
		samuel.setSingleParameter("initial " + alert, initpoop);
		samuel.setSingleParameter("fruit gt multiplier", zzzzzzzzzz);
		samuel.setSingleParameter("fruit time lag", zzzzz);
		samuel.setSingleParameter("diapause critical temp", zzzz);
		samuel.setSingleParameter("diapause daylight hours", zxczxc);
		
		for (double i = 0; i < rrrr; i += zxz) {
			samuel.run(temps, zxz, ignorefroot, ignorethepause, aaaa); // run the simulator
		}
		
		
		XYSeries[] toPRintorNotToPRINT = new XYSeries[8]; // array of data series for all lifestages, and fruit quality, vs time
		
		toPRintorNotToPRINT[0] = samuel.getEggSeries();
		toPRintorNotToPRINT[1] = samuel.getInst1Series();
		toPRintorNotToPRINT[2] = samuel.getInst2Series();
		toPRintorNotToPRINT[3] = samuel.getInst3Series();
		toPRintorNotToPRINT[4] = samuel.getPupaeSeries();
		toPRintorNotToPRINT[5] = samuel.getMalesSeries();
		toPRintorNotToPRINT[6] = samuel.getFemalesSeries();
		toPRintorNotToPRINT[7] = samuel.getFruitQualitySeries();
		
		try {
			for (int i = 0; i < 8; i ++) {
				if (toPRintorNotToPRINT[i] == null) // check to see if any of the series have not yet been initialized
					throw new NullPointerException();
				if (toPRintorNotToPRINT[i].getItemCount() == 0) // check to see if any of the series have no data points
					throw new NullPointerException();
			}
		} catch(NullPointerException error) { // thrown if none of the series have any points yet i.e. the simulation has not been run
			System.out.println("No data yet!  Cannot proceed.");
			return;
		}
		
		String datfile = "DATA/output___" + initpoop + alert + "_addedDay" + aaaa + "_" + 
										"harvLag" + zzzzz + "_gtMult" + zzzzzzzzzz + "_" +
										"tCrit" + zzzz + "_lightHours" + zxczxc + "_" +
									rrrr + "daysRun.txt";
		
		try {
			PrintWriter filtOot = new PrintWriter(new File(datfile));
			filtOot.print("Time:" + "\t");
			
			// all the series have the same number of data points
			
			// print daily data
			for (int j = 0; j < 7; j ++) { // print data labels
					filtOot.print(fruit[j] + ":\t");
			}
			filtOot.println();
			for (int i = 0; i < toPRintorNotToPRINT[0].getItemCount(); i +=20) { // += 20 so it prints every 20th datapoint (i.e. once per day)
				filtOot.print(toPRintorNotToPRINT[0].getX(i) + "\t"); // print the timestep (same for all series)
				for (int j = 0; j < 7; j ++) {
						filtOot.print(toPRintorNotToPRINT[j].getY(i) + "\t"); // print the corresponding value for the selected series
				}
				filtOot.println();
			}
			
			// print overall data
			filtOot.println("\n\nTotal Cumulative Populations");
			filtOot.print("\n\t" + samuel.getTotEggs() + "\t" + samuel.getTotInst1() + "\t" + samuel.getTotInst2() + 
							"\t" + samuel.getTotInst3() + "\t" + samuel.getTotPupae() + "\t" + samuel.getTotMales() + 
							"\t" + samuel.getTotFemales());
			filtOot.println("\n\nPeak Populations");
			filtOot.print("\n\t" + samuel.getMaxEggs() + "\t" + samuel.getMaxInst1() + "\t" + samuel.getMaxInst2() + 
					"\t" + samuel.getMaxInst3() + "\t" + samuel.getMaxPupae() + "\t" + samuel.getMaxMales() + 
					"\t" + samuel.getMaxFemales());
			filtOot.println("\n\nPeak Populations Day");
			filtOot.print("\n\t" + samuel.getDayMaxEggs() + "\t" + samuel.getDayMaxInst1() + "\t" + samuel.getDayMaxInst2() + 
					"\t" + samuel.getDayMaxInst3() + "\t" + samuel.getDayMaxPupae() + "\t" + samuel.getDayMaxMales() + 
					"\t" + samuel.getDayMaxFemales());
		
			filtOot.close();
		} catch (NullPointerException error) { // if no file was chosen
			return;
		} catch(FileNotFoundException error) {
			System.out.println("Error - output file not found");
		}

		System.out.println("\n\nProgram Done!");

	}
}