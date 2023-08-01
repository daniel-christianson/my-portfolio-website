const aspectRatioScript = {
javaScript:`// FIND ASPECT RATIO FROM PIXEL DIMENSIONS 
let answer = 'Y';
while (answer !== 'N') {
    console.clear();
    if (answer !== 'Y') {
        console.log("Invalid entry.");
        answer = prompt("Restart? (Y or N)").toUpperCase();
    } else {
        console.log("-------------------------------------------------");
        console.log("-------------------------------------------------");
        console.log("                                                 ");
        console.log("             ASPECT RATIO CALCULATOR             ");
        console.log("                                                 ");
        console.log("-------------------------------------------------");
        console.log("-------------------------------------------------");
        console.log("Please enter width and height:");
        let width = parseInt(prompt('Width?'), 10);
        let height = parseInt(prompt('Height?'), 10);
        console.log("");
        console.log("-------------------------------------------------");
        let aspectQuotient = width / height;
        console.log("- Width / Height = Aspect Ratio Quotient");
        console.log("- " + width + " / " + height + " = " + aspectQuotient.toFixed(2));
        console.log("");
        
        // Variable '$i' will always be a whole number starting with 1 and going up.
        // Loop while newWidth is not a whole number.
        // - Example: If newWidth modulus 1 does NOT equal 0, it is not a whole number, keep looping...
        console.log("-------------------------------------------------");
        console.log("Now we will multiply the quotient by 1, 2, ");
        console.log("3, etc., incrementing by 1 each time until");
        console.log("the product is a whole number.");
        console.log("");
        let i = 0;
        let newWidth = aspectQuotient * i;
        do {
            if (i < 10) {
                console.log(aspectQuotient.toFixed(2) + " * " + i + " = " + newWidth.toFixed(2));
                i += 1;
                newWidth = aspectQuotient * i;
            } else if (i === 11) {
                console.log("...");
                i += 1;
                newWidth = aspectQuotient * i;
            } else {
                i += 1;
                newWidth = aspectQuotient * i;
            }
        } while (newWidth.toFixed(2) % 1 !== 0);
        
        // When newWIdth is a whole number we will have the aspect ratio.
        console.log(aspectQuotient.toFixed(2) + " * " + i + " = " + newWidth.toFixed(2));
        console.log("");
        
        // Print the Aspect Ratio
        // First check if AR is 8:5, which is usually represented as 16:10.
        console.log("-------------------------------------------------");
        console.log("Aspect Ratio Quotient = " + aspectQuotient.toFixed(2));
        if (aspectQuotient.toFixed(2).toString(10) === '1.60' || aspectQuotient.toFixed(2).toString(10) === '0.63') {
            console.log("Aspect Ratio = 8:5 (aka: 16:10)");
        } else if (newWidth > i) {
            console.log("Aspect Ratio = " + newWidth + ":" + i);
        } else {
            console.log("Aspect Ratio = " + i + ":" + newWidth);
        }
        console.log("");
        console.log("-------------------------------------------------");
        console.log("");
        try {
            answer = prompt("Restart? (Y or N)").toUpperCase();
        } catch (error) {
            answer = 'N';
        }
    }
}`,
powerShell:`# FIND ASPECT RATIO FROM PIXEL DIMENSIONS
$Answer = 'Y'
While ($Answer -ne 'N') {
    Clear-Host
    If ($Answer -ne 'Y'){
        Write-Host "Invalid entry."
        $Answer = Read-Host "Restart? (Y or N)"
    } Else {
        Write-Host "-------------------------------------------------"
        Write-Host "-------------------------------------------------"
        Write-Host "                                                 "
        Write-Host "             ASPECT RATIO CALCULATOR             "
        Write-Host "                                                 "
        Write-Host "-------------------------------------------------"
        Write-Host "-------------------------------------------------"
        Write-Host "Please enter width and height:"
        [int]$width = Read-Host '- Width'
        [int]$height = Read-Host '- Height'
        Write-Host ""
        Write-Host "-------------------------------------------------"
        [double]$aspectQuotient = $width / $height
        Write-Host "- Width / Height = Aspect Ratio Quotient"
        Write-Host "- $width / $height ="([math]::Round($aspectQuotient, 2))
        Write-Host ""

        # Variable '$i' will always be a whole number starting with 1 and going up.
        # Loop while newWidth is not a whole number.
        # - Example: If newWidth modulus 1 does NOT equal 0, it is not a whole number, keep looping...
        Write-Host "-------------------------------------------------"
        Write-Host "Now we will multiply the quotient by 1, 2,"
        Write-Host "3, etc., incrementing by 1 each time until"
        Write-Host "the product is a whole number."
        Write-Host ""
        [int]$i = 0
        [double]$newWidth = $aspectQuotient * $i
        DO {
            IF ($i -le 10) {
                Write-Host ([math]::Round($aspectQuotient, 2))" * "$i" = "([math]::Round($newWidth, 2))
                $i += 1
                $newWidth = $aspectQuotient * $i
            } ELSEIF ($i -eq 11) {
                Write-Host "..."
                $i += 1
                $newWidth = $aspectQuotient * $i
            } ELSE {
                $i += 1
                $newWidth = $aspectQuotient * $i
            }
        } UNTIL ([math]::Round($newWidth, 2) % 1 -eq 0)

        # When newWidth is a whole number we will have the aspect ratio.
        Write-Host ([math]::Round($aspectQuotient, 2))" * "$i" = "([math]::Round($newWidth, 2))
        Write-Host ""

        # Print the Aspect Ratio
        # First check if AR is 8:5, which is usually represented as 16:10.
        Write-Host "-------------------------------------------------"
        Write-Host "Aspect Ratio Quotient ="([math]::Round($aspectQuotient, 2))
        IF ([math]::Round($aspectQuotient, 2) -eq 1.6 -or [math]::Round($aspectQuotient, 2) -eq 0.62) {
            Write-Host "Aspect Ratio = 8:5 (aka: 16:10)"
        } ELSEIF ($newWidth -gt $i) {
            Write-Host "Aspect Ratio ="$newWidth":"$i
        } ELSE {
            Write-Host "Aspect Ratio ="$i":"$newWidth
        }
        Write-Host ""
        Write-Host "-------------------------------------------------"
        Write-Host ""
        $Answer = Read-Host "Restart? (Y or N)"
    }
}`,
python:`# FIND ASPECT RATIO FROM PIXEL DIMENSIONS
def main():
    answer = 'Y'
    while(answer != 'N'):
        import os
        if os.name == 'nt':
            os.system('cls')
        else:
            os.system('clear')
        if(answer != 'Y'):
            print('Invalid entry.')
            answer = input('Restart? (Y or N)').title()
        else:
            print("-------------------------------------------------")
            print("-------------------------------------------------")
            print("                                                 ")
            print("             ASPECT RATIO CALCULATOR             ")
            print("                                                 ")
            print("-------------------------------------------------")
            print("-------------------------------------------------")
            print("Please enter width and height:")
            width = int(round(float(input('- Width: '))))
            height = int(round(float(input('- Height: '))))
            print("")
            print("-------------------------------------------------")
            aspectQuotient = width / height
            print("- Width / Height = Aspect Ratio Quotient")
            print("- ", width, " / ", height, " = ", round(aspectQuotient, 2), sep='')
            print("")

            # Variable '$i' will always be a whole number starting with 1 and going up.
            # Loop while newWidth is not a whole number.
            # - Example: If newWidth modulus 1 does NOT equal 0, it is not a whole number, keep looping...
            print("-------------------------------------------------")
            print("Now we will multiply the quotient by 1, 2,")
            print("3, etc., incrementing by 1 each time until")
            print("the product is a whole number.")
            print("")
            i = 1
            newWidth = aspectQuotient * i
            while round(newWidth, 2) % 1 != 0:
                if i <= 10:
                    print(round(aspectQuotient, 2), ' * ', i, ' = ', round(newWidth, 2), sep='')
                    i += 1
                    newWidth = aspectQuotient * i
                elif i == 11:
                    print("...")
                    i += 1
                    newWidth = aspectQuotient * i
                else:
                    i += 1
                    newWidth = aspectQuotient * i

            # When newWidth is a whole number we will have the aspect ratio.
            print(round(aspectQuotient, 2), ' * ', i, ' = ', round(newWidth), sep='')
            print("")

            # Print the Aspect Ratio
            # First check if AR is 8:5, which is usually represented as 16:10.
            print("-------------------------------------------------")
            print("Aspect Ratio Quotient = ", round(aspectQuotient, 2), sep='')
            if round(aspectQuotient, 2) == 1.6 or round(aspectQuotient, 2) == 0.62:
                print("Aspect Ratio = 8:5 (aka: 16:10)")
            elif int(newWidth) > i:
                print("Aspect Ratio = ", int(newWidth), ":", i, sep='')
            else:
                print("Aspect Ratio = ", i, ":", int(newWidth), sep='')

            print("")
            print("-------------------------------------------------")
            print("")
            answer = input("Restart? (Y or N)").title()
main()`
};
export default aspectRatioScript;