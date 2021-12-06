import Phaser from 'phaser';
import { Utils } from 'phaser';
import { Math } from 'phaser';
import * as rpgDiceRoller from '@dice-roller/rpg-dice-roller';
import NameGen from '../utils/namegen';

enum StatCategories {
  Brawn = "BRAWN",
  Prowess = "PROWESS",
  Guile = "GUILE",
  Mysticism = "MYSTICISM"
}

class Stat {
  name:StatCategories;
  value:number;

  constructor(name:StatCategories, value:number = -1) {
    this.name = name;
    this.value = value;
    if (value < 0) {
      this.RollStat();
    } 
  }

  public RollStat(modifier:number = 0) {
    this.value = new rpgDiceRoller.DiceRoll('4d6dl1').total + modifier;
  }
}

export default class Demo extends Phaser.Scene {

  firstNames: Array<string> =[];
  lastNames: Array<string> =[];

  nameBases: Array<string> = [];
  adjectives: Array<string> = [];
  races: Array<string> = [];
  stat_categories: Array<string> = [];
  nameLabel: any;
  generator: NameGen.Generator = new NameGen.Generator("ss");

  // particular adventurer
  name: string;
  stats: Array<Stat>;
  race: string;



  constructor() {
    super('GameScene');
    this.races = ["Human", "Dwarf", "Elf", "Skel", "Dragonblud", "Gnome", "Hobbo"]
    this.nameBases = ["wise","snake","son","thorn","mander","storm","lake","trim"];
    this.adjectives = ["Forlorn", "Gaunt", "Stout", "Terrible", "Clumsy", "Lucky", "Demonspawn", "Ugly",
         "Shifty", "Forked-Tongued","Stingy","Worrywort","Wind-swept","Gruff","Brave","Ashen","Mute","Crestfallen",
         "Lithe","Lusty"]
    
    // particular adventurer attributes
    // this.stats = this.RollStats();
    this.stats = [];


    this.name = "Default Name";
    this.race = "Unknown";
    this.nameLabel = new Text;
  }

  
  preload() {
    this.load.text('Human_first', 'assets/names/human_first.txt');
    this.load.text('Human_last', 'assets/names/human_last.txt');
  }

  create() {
    this.add.text(20, 20, "(reload for a fresh adventurer)", { fontFamily: 'Sans-serif', fontSize: 14 });
    this.race = "Human"; //temp 
    this.firstNames = this.TextToArray(this.race+'_first');
    this.lastNames = this.TextToArray(this.race + '_last');
    this.RollStats();




    this.name = this.CreateName();
    // Display the adventurer
    this.nameLabel = this.add.text(20, 150, this.name, { fontFamily: 'Alagard', fontSize: 48 });
    let y = 170
    // for (let i = 0; i < this.stat_categories.length; i++) {
    //   y += 30; //move down a bit
    //   this.add.text(20, y, this.stat_categories[i] + ": " + this.stats[i].toString(), { fontFamily: 'Alagard', fontSize: 18 });
      
    // } 
    this.stats.forEach(stat => {
      y += 30; //move down a bit
      this.add.text(20, y, stat.name + ": " + stat.value.toString(), { fontFamily: 'Alagard', fontSize: 24 });
    });
    
  }

  update() {

  }

  CreateName(): string {
    var name = "";

    // firstname
    if (Math.RND.frac() < .9) {
      if (Math.RND.frac() < .8) name = Utils.Array.GetRandom(this.firstNames);
      else name = this.CapitalizeFirstLetter(new NameGen.Generator('Dd').toString());
    }

    // Add a lastname
    if (Math.RND.frac() < .99) {
      if (name != "") name += " ";
      if (Math.RND.frac() < .5) {
        name += Utils.Array.GetRandom(this.lastNames);
      } else {
        name += this.CapitalizeFirstLetter(this.generator.toString());
      }
      // Add a syllable to last name
      if (Math.RND.frac() < .6) name += Utils.Array.GetRandom(this.lastNames).toLowerCase();
    }
    // if somehow there's still no name, force one
    if (name == "") name = Utils.Array.GetRandom(this.firstNames);

    // Add modifiers/adjectives (e.g. "the clumsy") TODO make them descriptive based on stat rolls
    if (Math.RND.frac() < .2) {
       name += " the " + Utils.Array.GetRandom(this.adjectives);
    }

    return name;
  }

  // RollStats(): Array<integer> {
  //   let stats:Array<integer> = [];
  //   this.stat_categories.forEach(stat => {
  //     // stats.push(this.RollDice(6,4,true));
  //     stats.push(new rpgDiceRoller.DiceRoll('4d6dl1').total);
  //   });
  //   return stats;
  // }

  RollStats() {
    for (const value in StatCategories) {
      this.stats.push(new Stat(value));
    }
  }

  TextToArray(key:string): Array<string> {
    let namesFile = this.cache.text.get(key);
    let namesArray = namesFile.split('\n').map(item => item.trim());;
    return namesArray;
  }

  GetAdjective(stats:Array<Stat>): string {
    let adjective = "";

    stats.forEach(stat => {
      // which stat is biggest outlier? 16+ or 6- -- could also reroll stat based on modifier (but that would throw off random distribution)
      
    });
    return adjective;
  }
  CapitalizeFirstLetter(s:string): string {
    return s[0].toUpperCase() + s.slice(1);
  }
  // Deprecated in favor of rpgDiceRoller library
  RollDice(sides:integer,number:integer,dropLowest:boolean=false): integer {
    var total = 0;
    var lowest = sides +1;
    for (let i = 0; i < number; i++) {
      var roll = Math.RND.integerInRange(1, sides);
      if (lowest > roll) {
        lowest = roll;
      }
      console.log("roll = " + roll);
      total += roll;
    }

    if (dropLowest) {
      total -= lowest;
    }
    return total;
  }


}
