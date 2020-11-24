package com.javacodeexamples.stringexamples;

public class StringCheckIfUpperCaseExample {
    public static void main(String[] args) {
        String str = "THISISANUPPERCASESTRINGYESITIS";
        System.out.println( "Is String uppercase?: " + isStringUpperCase(str) );
    }

    private static boolean isStringUpperCase(String str){

        //convert String to char array
        char[] charArray = str.toCharArray();

        for(int i=0; i < charArray.length; i++){

        //if any character is not in upper case, return false
        if( !Character.isUpperCase( charArray[i] ))
            return false;
        }
        return true;
    }
}