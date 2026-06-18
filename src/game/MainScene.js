import Phaser from "phaser";
import { playSound } from "../utils/sounds";

const BASE_ANT_SPEED = 200;
const FOOD_COUNT = 30;
const BASE_XP_TO_LEVEL_UP = 5;
const MAX_ANTS = 5;
const SPIDER_COUNT = 2;
const SPIDER_SPEED = 80;
const POTIONS_PER_ROUND = 3;
const POTION_HEAL = 30;

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  init(data) {
    this.world = data.world ?? {
      id: 1,
      name: "Desierto",
      color: "#d2b48c"
    };
  }

  preload() {}

  create() {
    const { width, height } = this.scale;
    
    // Crear fondo dinámico según el mundo
    this.createDynamicBackground(width, height);

    // Contador regresivo de 3 segundos
    this.startCountdown(width, height);

    // Inicializar variables globales
    this.cursors = this.input.keyboard.createCursorKeys();
    this.foodCollected = 0;
    this.playerLevel = 1;
    this.playerXP = 0;
    this.playerMaxHealth = 200;
    this.playerHealth = 200;
    this.xpToLevelUp = BASE_XP_TO_LEVEL_UP;
    this.colony = [];
    this.spiders = [];
    this.foods = [];
    this.potions = [];
    this.particles = [];
    this.baseSpeed = BASE_ANT_SPEED;
    this.gameOverFlag = false;
    this.countdownActive = true;
    this.remainingPotions = POTIONS_PER_ROUND;

    // Crear hormiga principal
    this.ant = this.createAnt(width / 2, height / 2, true);
    this.colony.push(this.ant);

    // Crear comida (más cantidad)
    this.createFood(width, height);

    // Crear pociones iniciales
    this.createPotions(width, height);

    // Crear arañas enemigas
    this.createSpiders(width, height);

    // Crear HUD
    this.createHud();

    // Eventos
    this.input.on("pointerdown", (pointer) => {
      if (!this.countdownActive) {
        this.createNewAnt(pointer.x, pointer.y);
      }
    });
  }

  createDynamicBackground(width, height) {
    const worldId = this.world.id;
    
    if (worldId === 1) {
      // Desierto: arena con dunas
      this.add.rectangle(width / 2, height / 2, width, height, 0xd2b48c);
      
      // Dunas de arena
      for (let i = 0; i < 5; i++) {
        this.add.ellipse(
          width * (i / 5) + 100,
          height - 100,
          150,
          60,
          0xc9a76b,
          0.3
        );
      }
      
      // Sol
      this.add.circle(width - 100, 100, 60, 0xffcc00);
      this.add.circle(width - 100, 100, 55, 0xffee00);
    } else if (worldId === 2) {
      // Océano: agua azul con olas
      this.add.rectangle(width / 2, height / 2, width, height, 0x4ea5ff);
      
      // Olas
      for (let i = 0; i < 10; i++) {
        this.add.line(
          0,
          0,
          i * (width / 10),
          height - 50 + Math.sin(i * 0.5) * 20,
          (i + 1) * (width / 10),
          height - 30 + Math.cos(i * 0.5) * 20,
          0x0066cc,
          2
        );
      }
    } else if (worldId === 3) {
      // Zona Tóxica: verde radioactivo
      this.add.rectangle(width / 2, height / 2, width, height, 0x66bb33);
      
      // Charcos tóxicos
      for (let i = 0; i < 4; i++) {
        this.add.circle(
          Math.random() * width,
          Math.random() * height,
          Math.random() * 50 + 30,
          0x00ff00,
          0.4
        );
      }
    } else if (worldId === 4) {
      // Bosque: verde oscuro con árboles
      this.add.rectangle(width / 2, height / 2, width, height, 0x228b22);
      
      // Árboles simples
      for (let i = 0; i < 8; i++) {
        const treeX = Math.random() * width;
        const treeY = Math.random() * height;
        this.add.rectangle(treeX, treeY + 30, 15, 60, 0x1a5f1a);
        this.add.circle(treeX, treeY, 40, 0x2d7a2d);
      }
    } else if (worldId === 5) {
      // Volcán: rojo y naranja con lava
      this.add.rectangle(width / 2, height / 2, width, height, 0x332200);
      
      // Lava
      for (let i = 0; i < 6; i++) {
        this.add.ellipse(
          width * Math.random(),
          height * Math.random(),
          100,
          50,
          0xff6600,
          0.5
        );
      }
      
      // Montaña volcánica
      this.add.polygon(
        width / 2,
        height + 100,
        [
          [-width / 2, -100],
          [width / 2, -100],
          [0, -400]
        ],
        0x661111
      );
    }

    // Agregar título del mundo
    this.add.text(20, 20, `🌍 MUNDO ${this.world.id} - ${this.world.name.toUpperCase()} 🌍`, {
      fontSize: "24px",
      color: "#fff",
      fontStyle: "bold",
      backgroundColor: "#00000099",
      padding: { x: 10, y: 5 },
      borderRadius: 4
    }).setDepth(999);
  }

  startCountdown(width, height) {
    // Fondo oscuro semi-transparente
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6);
    overlay.setDepth(2000);

    let timeLeft = 3;
    
    const countdownText = this.add.text(width / 2, height / 2, "3", {
      fontSize: "120px",
      color: "#00ff00",
      fontStyle: "bold",
      fontFamily: "'Arial Black', Arial",
      align: "center"
    });
    countdownText.setOrigin(0.5);
    countdownText.setDepth(2001);
    countdownText.setStroke("#ffff00", 4);

    // Usar delayedCall en lugar de addTimer
    const countdown = () => {
      timeLeft--;
      if (timeLeft > 0) {
        countdownText.setText(timeLeft.toString());
        // Animación de zoom
        this.tweens.add({
          targets: countdownText,
          scaleX: 1.5,
          scaleY: 1.5,
          duration: 300,
          yoyo: true
        });
        // Llamada recursiva
        this.time.delayedCall(1000, countdown);
      } else {
        // Eliminar overlay y texto
        overlay.destroy();
        countdownText.destroy();
        this.countdownActive = false;
      }
    };

    this.time.delayedCall(1000, countdown);
  }

  createAnt(x, y, isMain = false) {
    const ant = this.add.container(x, y);
    ant.isMain = isMain;
    ant.health = this.playerMaxHealth;
    ant.velocity = { x: 0, y: 0 };

    // Abdomen - parte trasera (mayor) - MEJORADO
    const abdomen = this.add.ellipse(0, 0, 40, 32, 0x2d2416);
    abdomen.setStrokeStyle(2, 0x1a0f08);
    
    // Segmentos del abdomen
    const segment1 = this.add.ellipse(-8, 0, 15, 28, 0x3d2d1f);
    segment1.setStrokeStyle(1, 0x1a0f08);
    const segment2 = this.add.ellipse(8, 0, 15, 28, 0x4d3d2f);
    segment2.setStrokeStyle(1, 0x1a0f08);
    
    // Tórax - parte central - MEJORADO
    const thorax = this.add.ellipse(20, 0, 30, 26, 0x6d4d35);
    thorax.setStrokeStyle(2, 0x3d2d1f);
    
    // Cabeza - parte frontal - MEJORADA
    const head = this.add.ellipse(38, 0, 24, 22, 0x4d3d2f);
    head.setStrokeStyle(2, 0x1a0f08);

    // Mandíbulas mejoradas
    const jaw1 = this.add.line(0, 0, 46, -4, 54, -7, 0x1a0f08);
    jaw1.setStrokeStyle(2.5, 0x1a0f08);
    const jaw2 = this.add.line(0, 0, 46, 4, 54, 7, 0x1a0f08);
    jaw2.setStrokeStyle(2.5, 0x1a0f08);

    // Antenas mejoradas (2 - con articulaciones)
    const leftAntenna1 = this.add.line(0, 0, 40, -8, 50, -20, 0x0a0a0a);
    leftAntenna1.setStrokeStyle(2.5, 0x0a0a0a);
    const leftAntenna2 = this.add.line(0, 0, 50, -20, 60, -32, 0x1a0f08);
    leftAntenna2.setStrokeStyle(2, 0x1a0f08);

    const rightAntenna1 = this.add.line(0, 0, 40, 8, 50, 20, 0x0a0a0a);
    rightAntenna1.setStrokeStyle(2.5, 0x0a0a0a);
    const rightAntenna2 = this.add.line(0, 0, 50, 20, 60, 32, 0x1a0f08);
    rightAntenna2.setStrokeStyle(2, 0x1a0f08);

    // Ojos mejorados (2 grandes)
    const eye1 = this.add.circle(42, -6, 4, 0x000000);
    eye1.setStrokeStyle(1, 0xffffff);
    const eye2 = this.add.circle(42, 6, 4, 0x000000);
    eye2.setStrokeStyle(1, 0xffffff);
    
    // Pupilas brillantes
    const pupil1 = this.add.circle(43, -5, 2, 0xffffff);
    const pupil2 = this.add.circle(43, 7, 2, 0xffffff);

    // Patas mejoradas (3 a cada lado, más realistas)
    const leg1 = this.add.line(0, 0, 10, -12, -8, -28, 0x1a0f08);
    leg1.setStrokeStyle(2.5, 0x1a0f08);
    
    const leg2 = this.add.line(0, 0, 22, -12, 25, -28, 0x2d1a0f);
    leg2.setStrokeStyle(2.5, 0x2d1a0f);
    
    const leg3 = this.add.line(0, 0, 32, -12, 40, -28, 0x1a0f08);
    leg3.setStrokeStyle(2.5, 0x1a0f08);

    const leg4 = this.add.line(0, 0, 10, 12, -8, 28, 0x1a0f08);
    leg4.setStrokeStyle(2.5, 0x1a0f08);
    
    const leg5 = this.add.line(0, 0, 22, 12, 25, 28, 0x2d1a0f);
    leg5.setStrokeStyle(2.5, 0x2d1a0f);
    
    const leg6 = this.add.line(0, 0, 32, 12, 40, 28, 0x1a0f08);
    leg6.setStrokeStyle(2.5, 0x1a0f08);

    ant.add([
      abdomen, segment1, segment2, thorax, head,
      jaw1, jaw2,
      leftAntenna1, leftAntenna2, rightAntenna1, rightAntenna2,
      eye1, eye2, pupil1, pupil2,
      leg1, leg2, leg3, leg4, leg5, leg6
    ]);

    ant.setDepth(100);
    return ant;
  }

  createNewAnt(x, y) {
    if (this.colony.length >= MAX_ANTS) {
      return;
    }

    playSound("foodCollect");
    const newAnt = this.createAnt(x, y, false);
    this.colony.push(newAnt);
  }

  createSpiders(width, height) {
    for (let i = 0; i < SPIDER_COUNT; i++) {
      const spider = {
        container: this.add.container(
          Phaser.Math.Between(100, width - 100),
          Phaser.Math.Between(150, height - 150)
        ),
        health: 20,
        speed: SPIDER_SPEED,
        target: null,
        moveTimer: 0,
        moveInterval: 2000
      };

      // Cuerpo cefalotórax (cabeza-cuerpo) - MÁS REALISTA
      const cephalothorax = this.add.ellipse(0, 0, 32, 40, 0x1a0a1a);
      cephalothorax.setStrokeStyle(2, 0x0a0000);
      
      // Abdomen - MÁS REALISTA
      const abdomen = this.add.ellipse(0, 22, 40, 50, 0x3d0a3d);
      abdomen.setStrokeStyle(2, 0x1a0a1a);
      
      // Segmentos del abdomen
      const abdominalSegment1 = this.add.arc(0, 15, 38, 0, Math.PI * 2, false, 0x4d1a4d);
      const abdominalSegment2 = this.add.arc(0, 28, 36, 0, Math.PI * 2, false, 0x3d0a3d);
      
      // Cabeza (chelicerae y fangs)
      const head = this.add.ellipse(0, -15, 20, 18, 0x2d0a2d);
      head.setStrokeStyle(1, 0x0a0000);
      
      // Colmillos venenosos (fangs)
      const fang1 = this.add.line(0, 0, -5, -8, -8, -15, 0x8b0000);
      fang1.setStrokeStyle(2, 0x8b0000);
      const fang2 = this.add.line(0, 0, 5, -8, 8, -15, 0x8b0000);
      fang2.setStrokeStyle(2, 0x8b0000);
      
      // 8 Ojos distribuidos - MÁS REALISTAS
      const eyes = [];
      for (let j = 0; j < 8; j++) {
        const angle = (j / 8) * Math.PI * 2;
        const radius = 10;
        const eyeX = Math.cos(angle) * radius;
        const eyeY = Math.sin(angle) * radius - 12;
        const eye = this.add.circle(eyeX, eyeY, 3, 0xff0000);
        eye.setStrokeStyle(1.5, 0xaa0000);
        eyes.push(eye);
      }

      // 8 Patas - MÁS REALISTAS
      const legs = [];
      for (let j = 0; j < 8; j++) {
        const side = j < 4 ? -1 : 1;
        const legIdx = j % 4;
        const startY = -8 + legIdx * 14;
        
        // Primera sección (coxa)
        const leg1 = this.add.line(
          0, 0,
          -2, startY,
          side * 16, startY - 8,
          0x5c0a5c
        );
        leg1.setStrokeStyle(2.5, 0x5c0a5c);
        
        // Segunda sección (femur)
        const leg2 = this.add.line(
          0, 0,
          side * 16, startY - 8,
          side * 28, startY - 4,
          0x4d0a4d
        );
        leg2.setStrokeStyle(2.5, 0x4d0a4d);
        
        // Tercera sección (tibia)
        const leg3 = this.add.line(
          0, 0,
          side * 28, startY - 4,
          side * 40, startY + 10,
          0x3d0a3d
        );
        leg3.setStrokeStyle(2.5, 0x3d0a3d);
        
        legs.push(leg1);
        legs.push(leg2);
        legs.push(leg3);
      }

      spider.container.add([
        cephalothorax, abdomen, abdominalSegment1, abdominalSegment2,
        head, fang1, fang2,
        ...eyes,
        ...legs
      ]);
      spider.container.setDepth(50);
      this.spiders.push(spider);
    }
  }

  createFood(width, height) {
    for (let i = 0; i < FOOD_COUNT; i++) {
      const foodType = Math.random();
      let fruit;
      
      if (foodType < 0.33) {
        // Manzana roja
        fruit = this.add.circle(
          Phaser.Math.Between(80, width - 80),
          Phaser.Math.Between(120, height - 80),
          11,
          0xff3333
        );
        fruit.setStrokeStyle(2, 0xcc0000);
        fruit.type = "apple";
      } else if (foodType < 0.66) {
        // Plátano amarillo
        fruit = this.add.arc(
          Phaser.Math.Between(80, width - 80),
          Phaser.Math.Between(120, height - 80),
          12,
          0,
          Math.PI,
          false,
          0xffdd33
        );
        fruit.setStrokeStyle(2, 0xddaa00);
        fruit.type = "banana";
      } else {
        // Cereza naranja
        fruit = this.add.circle(
          Phaser.Math.Between(80, width - 80),
          Phaser.Math.Between(120, height - 80),
          10,
          0xff9933
        );
        fruit.setStrokeStyle(2, 0xff6600);
        fruit.type = "orange";
      }
      
      fruit.setDepth(10);
      fruit.collectible = true;
      this.foods.push(fruit);
    }
  }

  createPotions(width, height) {
    for (let i = 0; i < POTIONS_PER_ROUND; i++) {
      const potion = this.add.circle(
        Phaser.Math.Between(80, width - 80),
        Phaser.Math.Between(120, height - 80),
        10,
        0x00ff00
      );
      potion.setStrokeStyle(2, 0x00aa00);
      potion.setDepth(10);
      potion.isPotion = true;
      potion.healing = POTION_HEAL;
      this.potions.push(potion);
    }
  }

  createBloodEffect(x, y) {
    // Gotas de sangre que salen hacia afuera
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const bloodDrop = this.add.circle(x, y, 3, 0xff0000);
      
      this.tweens.add({
        targets: bloodDrop,
        x: x + Math.cos(angle) * 50,
        y: y + Math.sin(angle) * 50,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          bloodDrop.destroy();
        }
      });
    }

    // Impacto visual (círculo que se expande)
    const impactCircle = this.add.circle(x, y, 5, 0xff3333);
    impactCircle.setStrokeStyle(2, 0xff0000);
    impactCircle.setAlpha(0.7);
    
    this.tweens.add({
      targets: impactCircle,
      radius: 25,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        impactCircle.destroy();
      }
    });
  }

  createHud() {
    // Fondo del HUD
    this.hudBg = this.add.rectangle(160, 140, 360, 280, 0x000000, 0.4);
    this.hudBg.setStrokeStyle(3, 0x00ff00);
    this.hudBg.setDepth(999);

    this.foodText = this.add.text(20, 60, "🍖 COMIDA: 0", {
      fontSize: "18px",
      color: "#ffff00",
      fontStyle: "bold",
      fontFamily: "'Arial Black', Arial"
    });
    this.foodText.setDepth(1000);

    this.levelText = this.add.text(20, 90, "⭐ NIVEL: 1", {
      fontSize: "18px",
      color: "#00ff00",
      fontStyle: "bold",
      fontFamily: "'Arial Black', Arial"
    });
    this.levelText.setDepth(1000);

    this.xpText = this.add.text(20, 120, "✨ XP: 0/5", {
      fontSize: "16px",
      color: "#00ffff",
      fontFamily: "'Arial Black', Arial"
    });
    this.xpText.setDepth(1000);

    this.healthText = this.add.text(20, 150, "❤️ SALUD: 200/200", {
      fontSize: "16px",
      color: "#ff0000",
      fontFamily: "'Arial Black', Arial"
    });
    this.healthText.setDepth(1000);

    this.colonySizeText = this.add.text(20, 180, "🐜 COLONIA: 1/5", {
      fontSize: "16px",
      color: "#ffaa00",
      fontFamily: "'Arial Black', Arial"
    });
    this.colonySizeText.setDepth(1000);

    this.speedText = this.add.text(20, 210, "⚡ VELOCIDAD: 200", {
      fontSize: "16px",
      color: "#ffffff",
      fontFamily: "'Arial Black', Arial"
    });
    this.speedText.setDepth(1000);

    this.potionsText = this.add.text(20, 240, "🧪 POCIONES: 3/3", {
      fontSize: "16px",
      color: "#00ff00",
      fontFamily: "'Arial Black', Arial"
    });
    this.potionsText.setDepth(1000);
  }

  update(_time, delta) {
    if (!this.ant || !this.cursors || this.gameOverFlag || this.countdownActive) {
      return;
    }

    const { width, height } = this.scale;
    const moveSpeed = this.baseSpeed * (delta / 1000);

    // Movimiento de la hormiga principal
    let moved = false;
    let dirX = 0;
    let dirY = 0;

    if (this.cursors.left.isDown) {
      dirX = -1;
      moved = true;
    } else if (this.cursors.right.isDown) {
      dirX = 1;
      moved = true;
    }

    if (this.cursors.up.isDown) {
      dirY = -1;
      moved = true;
    } else if (this.cursors.down.isDown) {
      dirY = 1;
      moved = true;
    }

    if (moved) {
      this.ant.x += dirX * moveSpeed;
      this.ant.y += dirY * moveSpeed;

      if (dirX !== 0 || dirY !== 0) {
        this.ant.rotation = Math.atan2(dirY, dirX);
      }

      this.keepAntInsideWorld(this.ant, width, height);
      this.collectFood();
      this.collectPotions();
    }

    // Mover otras hormigas de la colonia (IA simple)
    for (let i = 1; i < this.colony.length; i++) {
      const ant = this.colony[i];
      const randomChance = Math.random();
      
      if (randomChance < 0.7) {
        const angle = Math.random() * Math.PI * 2;
        ant.x += Math.cos(angle) * moveSpeed * 0.8;
        ant.y += Math.sin(angle) * moveSpeed * 0.8;
        ant.rotation = angle;
      }

      this.keepAntInsideWorld(ant, width, height);
    }

    // Actualizar arañas
    this.updateSpiders(width, height, moveSpeed);

    // Colisiones entre arañas y hormigas
    this.checkSpiderCollisions();

    // Regenerar comida si se agota
    if (this.foods.length < 10) {
      this.createFood(width, height);
    }

    // Actualizar HUD
    this.updateHud();
  }

  updateSpiders(width, height, moveSpeed) {
    this.spiders.forEach((spider) => {
      spider.moveTimer += moveSpeed * 100;

      if (spider.moveTimer >= spider.moveInterval) {
        spider.moveTimer = 0;
        const angle = Math.random() * Math.PI * 2;
        spider.velocity = {
          x: Math.cos(angle) * spider.speed,
          y: Math.sin(angle) * spider.speed
        };
      }

      let closestAnt = null;
      let minDistance = 150;

      for (const ant of this.colony) {
        const distance = Phaser.Math.Distance.Between(
          spider.container.x,
          spider.container.y,
          ant.x,
          ant.y
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestAnt = ant;
        }
      }

      if (closestAnt) {
        const angle = Phaser.Math.Angle.Between(
          spider.container.x,
          spider.container.y,
          closestAnt.x,
          closestAnt.y
        );
        spider.container.x += Math.cos(angle) * spider.speed * 0.03;
        spider.container.y += Math.sin(angle) * spider.speed * 0.03;
        spider.container.rotation = angle;
      } else {
        spider.container.x += (spider.velocity?.x || 0) * 0.02;
        spider.container.y += (spider.velocity?.y || 0) * 0.02;
      }

      spider.container.x = Phaser.Math.Clamp(spider.container.x, 50, width - 50);
      spider.container.y = Phaser.Math.Clamp(spider.container.y, 50, height - 50);
    });
  }

  checkSpiderCollisions() {
    this.spiders = this.spiders.filter((spider) => {
      if (spider.health <= 0) {
        playSound("spiderDeath");
        this.createBloodEffect(spider.container.x, spider.container.y);
        spider.container.destroy();
        return false;
      }

      for (let i = 0; i < this.colony.length; i++) {
        const ant = this.colony[i];
        const distance = Phaser.Math.Distance.Between(
          spider.container.x,
          spider.container.y,
          ant.x,
          ant.y
        );

        if (distance < 40) {
          ant.health -= 2;
          playSound("damage");
          this.createBloodEffect(ant.x, ant.y);

          if (ant.health <= 0) {
            if (ant.isMain) {
              this.playerHealth = 0;
              this.gameOver();
            } else {
              ant.destroy();
              this.colony.splice(i, 1);
            }
          }

          spider.health -= 2;
          return true;
        }
      }

      return true;
    });
  }

  keepAntInsideWorld(ant, width, height) {
    ant.x = Phaser.Math.Clamp(ant.x, 40, width - 40);
    ant.y = Phaser.Math.Clamp(ant.y, 40, height - 40);
  }

  collectFood() {
    this.foods = this.foods.filter((food) => {
      const distance = Phaser.Math.Distance.Between(
        this.ant.x,
        this.ant.y,
        food.x,
        food.y
      );

      if (distance >= 25) {
        return true;
      }

      food.destroy();
      this.addFoodProgress();
      return false;
    });
  }

  collectPotions() {
    this.potions = this.potions.filter((potion) => {
      const distance = Phaser.Math.Distance.Between(
        this.ant.x,
        this.ant.y,
        potion.x,
        potion.y
      );

      if (distance >= 25) {
        return true;
      }

      const healAmount = potion.healing;
      this.playerHealth = Math.min(this.playerHealth + healAmount, this.playerMaxHealth);
      this.remainingPotions -= 1;
      playSound("levelUp");
      potion.destroy();
      return false;
    });
  }

  addFoodProgress() {
    this.foodCollected += 1;
    this.playerXP += 1;
    
    playSound("foodCollect");

    if (this.playerXP >= this.xpToLevelUp) {
      this.levelUp();
    }

    this.playerHealth = Math.min(
      this.playerHealth + 2,
      this.playerMaxHealth
    );
  }

  levelUp() {
    this.playerLevel += 1;
    this.playerXP = 0;
    this.xpToLevelUp = BASE_XP_TO_LEVEL_UP + (this.playerLevel - 1) * 2;
    this.baseSpeed += 30;
    this.playerMaxHealth += 30;
    this.playerHealth = this.playerMaxHealth;
    this.remainingPotions = POTIONS_PER_ROUND;
    
    playSound("levelUp");
  }

  updateHud() {
    this.foodText.setText(`🍖 COMIDA: ${this.foodCollected}`);
    this.levelText.setText(`⭐ NIVEL: ${this.playerLevel}`);
    this.xpText.setText(`✨ XP: ${this.playerXP}/${this.xpToLevelUp}`);
    this.healthText.setText(`❤️ SALUD: ${Math.max(0, this.playerHealth)}/${this.playerMaxHealth}`);
    this.colonySizeText.setText(`🐜 COLONIA: ${this.colony.length}/${MAX_ANTS}`);
    this.speedText.setText(`⚡ VELOCIDAD: ${this.baseSpeed.toFixed(0)}`);
    this.potionsText.setText(`🧪 POCIONES: ${Math.max(0, this.remainingPotions)}/3`);
  }

  gameOver() {
    this.gameOverFlag = true;
    playSound("gameOver");

    const { width, height } = this.scale;

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    overlay.setDepth(1001);

    const gameOverText = this.add.text(
      width / 2,
      height / 2 - 100,
      "💀 GAME OVER 💀",
      {
        fontSize: "80px",
        color: "#ff0000",
        fontStyle: "bold",
        fontFamily: "'Arial Black', Arial",
        align: "center"
      }
    );
    gameOverText.setOrigin(0.5);
    gameOverText.setDepth(1002);
    gameOverText.setStroke("#ffff00", 4);

    const statsText = this.add.text(
      width / 2,
      height / 2 + 50,
      `⭐ NIVEL: ${this.playerLevel}\n🍖 COMIDA: ${this.foodCollected}\n🐜 COLONIA: ${this.colony.length}`,
      {
        fontSize: "32px",
        color: "#ffff00",
        fontStyle: "bold",
        fontFamily: "'Arial Black', Arial",
        align: "center"
      }
    );
    statsText.setOrigin(0.5);
    statsText.setDepth(1002);
  }
}
