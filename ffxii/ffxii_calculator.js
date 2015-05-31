$(document).ready(function () {
    $("button").hover(
        function() {$(this).addClass("calculate-btn-hover");},
        function() {$(this).removeClass("calculate-btn-hover");}
    );
    $("button").click(function () {        
        //grabbing character stats:
        var charName = $("input[name=charName]").val();
        var charLvl = +$("input[name=charLvl]").val();
        var charStr = +$("input[name=charStr]").val();
        var charMag = +$("input[name=charMag]").val();        
        var charSpeed = +$("input[name=charSpeed]").val();        
        var charVit = +$("input[name=charVit]").val();          
        
        //enemy stat assumptions
        var enDefRatio = 0.62240116
        var enMagDefRatio = 0.69858962
        
        //setting enemy defense and magic defense:
        var enLvl = +$("input[name=enLvl]").val();
        $("input[name=enDef]").val(Math.round(enLvl*enDefRatio));
        $("input[name=enMagDef]").val(Math.round(enLvl*enMagDefRatio));
        var enDef = +$("input[name=enDef]").val();
        var enMagDef = +$("input[name=enMagDef]").val();
        
        //grabbing weapon info:
        var weaponType = $(".weapon-type").val();
        var attPower = +$("input[name=attPower]").val();
        
        // weapon object constructor
        function Weapon(type, chargeTime, actionTime, evade, comboRate, perks) {
            this.type = type;            
            this.attackTime = Math.round((chargeTime + actionTime)*100)/100;
            this.evade = evade;
            this.comboRate = comboRate + "%";
            this.perks = perks;
            this.damageLow = function () {
                switch (type) {
                    case "Sword":
                    case "Greatsword":
                    case "Spear":
                    case "Rod":
                    case "Crossbow":
                        return (attPower-enDef)*(1+(charStr*(charLvl+charStr)/256));
                        break;
                    case "Dagger":
                    case "Ninja Sword":
                    case "Bow":
                        return (attPower-enDef)*(1+(charStr*(charLvl+charSpeed)/218));
                        break;
                    case "Ax":
                    case "Hammer":
                    case "Hand-Bomb":
                        return 0;
                        break;
                    case "Mace":
                        return (attPower-enDef)*(1+(charMag*(charLvl+charMag)/256));
                        break;
                    case "Measure":
                    case "Gun":
                        return Math.pow(attPower,2);
                        break;
                    case "Katana":
                    case "Staff":
                        return (attPower-enDef)*(1+(charStr*(charLvl+charMag)/256));
                        break;
                    case "Pole":
                        return (attPower-enMagDef)*(1+(charStr*(charLvl+charStr)/256));
                        break;
                    default:
                        return "No damage type listed";
                };
            };
            this.damageHigh = function () {
                switch (type) {
                    case "Sword":
                    case "Greatsword":
                    case "Spear":
                    case "Rod":
                    case "Crossbow":
                        return (attPower*1.125-enDef)*(1+(charStr*(charLvl+charStr)/256));
                        break;
                    case "Dagger":
                    case "Ninja Sword":
                    case "Bow":
                        return (attPower*1.125-enDef)*(1+(charStr*(charLvl+charSpeed)/218));
                        break;
                    case "Ax":
                    case "Hammer":
                    case "Hand-Bomb":
                        return (attPower*1.111-enDef)*(1+(charStr*(charLvl+charVit)/128));
                        break;
                    case "Mace":
                        return (attPower*1.125-enDef)*(1+(charMag*(charLvl+charMag)/256));
                        break;
                    case "Measure":
                    case "Gun":
                        return Math.pow(attPower*1.125,2);
                        break;
                    case "Katana":
                    case "Staff":
                        return (attPower*1.125-enDef)*(1+(charStr*(charLvl+charMag)/256));
                        break;
                    case "Pole":
                        return (attPower*1.125-enMagDef)*(1+(charStr*(charLvl+charStr)/256));
                        break;
                    default:
                        return "No damage type listed";
                };
            };
        };
                
        // define weapon objects
        var sword = new Weapon("Sword", 2.88, 1.2, 5, 5, ["one handed", "knockback chance"]);
        var dagger = new Weapon("Dagger", 1.89, 1.2, 5, 7, ["one handed", "status effects (usually)"]);
        var ax = new Weapon("Ax", 2.39, 1.2, 6, 3, ["one handed", "knockback chance"]);
        var hammer = new Weapon("Hammer", 2.63, 1.2, 2, 7, ["one handed", "knockback chance"]);
        var mace = new Weapon("Mace", 2.63, 1.2, 4, 4, ["one handed"]);
        var measure = new Weapon("Measure", 2.63, 1.2, 25, 5, ["one handed", "can't parry or block", "positive status effects"]);
        var greatsword = new Weapon("Greatsword", 2.47, 1.2, 10, 7, ["knockback chance"]);
        var katana = new Weapon("Katana", 2.39, 1.2, 5, 13, []);
        var ninjaSword = new Weapon("Ninja Sword", 1.97, 1.2, 20, 18, ["dark elemental"]);
        var spear = new Weapon("Spear", 2.14, 1.2, 8, 4, ["knockback chance"]);
        var pole = new Weapon("Pole", 2.47, 1.2, 25, 12, ["knockback chance"]);
        var rod = new Weapon("Rod", 2.72, 1.2, 6, 0, ["knockback chance", "+MP", "+Magic"]);
        var staff = new Weapon("Staff", 2.8, 1.2, 8, 0, ["knockback change", "+Magic", "magic elemental boosts"]);
        var bow = new Weapon("Bow", 2.96, 1.4, 0, 5, ["Ranged", "knockback chance"]);
        var crossbow = new Weapon("Crossbow", 2.3, 1.4, 5, 7, ["Ranged", "can't parry"]);
        var gun = new Weapon("Gun", 4.2, 1.4, 10, 5, ["Ranged", "100% accuracy", "can't parry or block", "knockback chance"]);
        var handBomb = new Weapon("Hand-Bomb", 2.8, 1.4, 0, 0, ["Ranged"]);
                       
        //results
        switch (weaponType) {
            case "Sword":
                var weapon = sword;
                break;
            case "Dagger":
                var weapon = dagger;
                break;
            case "Ax":
                var weapon = ax;
                break;
            case "Hammer":
                var weapon = hammer;
                break;
            case "Mace":
                var weapon = mace;
                break;
            case "Measure":
                var weapon = measure;
                break;
            case "Greatsword":
                var weapon = greatsword;
                break;
            case "Katana":
                var weapon = katana;
                break;
            case "Ninja Sword":
                var weapon = ninjaSword;
                break;
            case "Spear":
                var weapon = spear;
                break;
            case "Pole":
                var weapon = pole;
                break;
            case "Rod":
                var weapon = rod;
                break;
            case "Staff":
                var weapon = staff;
                break;
            case "Bow":
                var weapon = bow;
                break;
            case "Crossbow":
                var weapon = crossbow;
                break;
            case "Gun":
                var weapon = gun;
                break;
            case "Hand-Bomb":
                var weapon = handBomb;
                break;
        };
            
        var perksList = "";
        for (var i = 0; i < weapon.perks.length; i++) {
            perksList += "&bull; " + weapon.perks[i] + "<br>";
        };
        
        var result = function() {
            $("tbody").prepend("<tr><td>" + charName + "</td><td>" + weapon.type + "</td><td>" + weapon.attackTime + "</td><td>" + weapon.evade + "</td><td>" + weapon.comboRate + "</td><td>" + Math.round(weapon.damageLow()) + " - " + Math.round(weapon.damageHigh()) + "</td><td>" + weapon.perks.length + "</td><td>" + perksList + "</td></tr>");
        };
        result();
    }); 
}); 
