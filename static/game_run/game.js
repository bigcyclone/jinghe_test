$(function() {
	var w = $(window).width();
	var h = $(window).height();
	var ratio = w / 640;
	var r_w = w / ratio;
	var r_h = 640 / w * h;
	//var r_h = h;
	var config = {
		type: Phaser.AUTO,
		width: r_w,
		height: r_h,
		backgroundColor: '#40c3d1',
		parent: 'game',
		physics: {
			default: 'arcade',
			arcade: {
				gravity: {
					y: 0
				},
				debug: false
			}
		},
		scene: {
			preload: preload,
			create: create,
			update: update,
		}
	};

	var game = new Phaser.Game(config);

	var thing_left_start_x = -90;
	var thing_left_start_y = r_h - 510;
	var thing_left_end_x = 250;
	var thing_left_end_y = r_h - 865;

	var thing_right_start_y = r_h - 510;
	var thing_right_start_x = r_w + 90;
	var thing_right_end_x = r_w - 250;
	var thing_right_end_y = r_h - 865;
	var thing_time_event;

	var count_time = 30;
	var count_time_interval;
	var direction = 1;
	var person;
	var group_left;
	var group_right;
	var group;
	var random_left_list = [];
	var random_right_list = [];
	var gem_left;
	var gem_center;
	var gem_right;
	var person_y=r_h/2+r_h/12;
	var gem_end_y = person_y-30;
	var gem_left_start_x = -90;
	var gem_left_start_y = r_h;
	var gem_center_start_x = r_w / 2;
	var gem_center_start_y = r_h;
	var gem_right_start_x = r_w+90;
	var gem_right_start_y = r_h;
	var gem_right_end_x = r_w/2+r_w/2/8;
	var gem_left_end_x = r_w/2-r_w/2/8;
	var gem_center_end_x = r_w / 2;


	var group_left;
	var group_center;
	var group_right;
	var gem_time_event;
	window._t = null;


	function set_postion(height) {
		person_y = height;
		gem_end_y = person_y-30;
    }


	function preload() {
		this.load.image('way', '/static/game_run/p2_way.png');
		this.load.image('house', '/static/game_run/p2_house.png');
		this.load.image('bg', '/static/game_run/p_r_bg.jpg');
		/*
		this.load.image('s1', '/static/game_run/p2_s1.png');
		this.load.image('s2', '/static/game_run/p2_s2.png');
		this.load.image('s3', '/static/game_run/p2_s3.png');
		this.load.image('s4', '/static/game_run/p2_s4.png');
		this.load.image('s5', '/static/game_run/p2_s5.png');
		*/

		this.load.image('gps', '/static/game_run/location.png');
		this.load.image('gem1', '/static/game_run/p2_gem1.png');
		this.load.image('gem2', '/static/game_run/p2_gem2.png');
		this.load.image('gem3', '/static/game_run/p2_gem3.png');
		this.load.image('gem4', '/static/game_run/p2_gem4.png');
		this.load.image('gem5', '/static/game_run/p2_gem5.png');
		this.load.image('gem6', '/static/game_run/p2_gem6.png');
		this.load.image('gem7', '/static/game_run/p2_gem7.png');
		this.load.image('gem8', '/static/game_run/p2_gold.png');
		this.load.image('gem9', '/static/game_run/p2_zd.png');
		this.load.image('gem10', '/static/game_run/za.png');

		this.load.spritesheet('person', '/static/game_run/p2_person.png', {
			frameWidth: 150,
			frameHeight: 312,
		});
	}
function create() {
		var _this = this;
		_t = this;
		this.cameras.main.setZoom(ratio).setOrigin(0, 0);
		var bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
		bg.width = r_w;
		bg.height = r_h;



		var house = this.add.image(0, 0, 'house').setOrigin(0, 0);
		var way = this.add.image(0, 0, 'way').setOrigin(0, 0);

		house.y = r_h - way.height;
		way.y = r_h - way.height;
		set_postion(way.y+r_h/10);
		//way.x = -r_w/4;
		way.setScale(1,1);



		var gps = this.add.sprite(r_w/2, person_y-180, 'gps');
		_t.tweens.add({
            targets: gps,
            props: {
                y: {
                    value: person_y-210,
                    delay: 50
                }
            },
            ease: 'Power1',
            duration: 1000,
            yoyo: true,
            paused: false,
            autostart:true,
            loop:-1
        });


		group_left = this.physics.add.group();
		group_center = this.physics.add.group();
		group_right = this.physics.add.group();


		for (var i = 1; i < 30; i++) {
			var left_ran = Phaser.Math.Between(1, 9);
			var center_ran = Phaser.Math.Between(1, 10);
			var right_ran = Phaser.Math.Between(1, 9);
			var gem_t_left = group_left.create(gem_left_start_x, gem_left_start_y, 'gem' + left_ran);
			var gem_t_center = group_center.create(gem_center_start_x, gem_center_start_y, 'gem' + center_ran);
			var gem_t_right = group_right.create(gem_right_start_x, gem_right_start_y, 'gem' + right_ran);
			gem_t_left.gem_index = left_ran;
			gem_t_center.gem_index = center_ran;
			gem_t_right.gem_index = right_ran;

			gem_t_left.setVisible(false);
			gem_t_center.setVisible(false);
			gem_t_right.setVisible(false);
		}


		var walk_config = {
			key: 'walk',
			frames: this.anims.generateFrameNumbers('person'),
			frameRate: 10,
			repeat: -1
		};
		var anim = this.anims.create(walk_config);
		var anim2 = this.anims.create({
			key:'jump',
			frames:[{key:'person',frame:6}],
			repeat:0
		})
		// person  = this.add.sprite( r_w/2,r_h - 875,'person');
		person = this.physics.add.sprite(r_w / 2, person_y, 'person');
		person.setScale(0.8,0.8);
		person.isHit = false;
		person.isJump = false;
		person.anims.load('walk');
		person.anims.load('jump');

		/*
		thing_time_event = this.time.addEvent({
			delay: 1000,
			callback: random_things,
			callbackScope: this,
			loop: true
		});
		*/
		count_time_interval = this.time.addEvent({
			delay: 1000,
			callback: function() {
				--count_time;
				if (count_time <= 0) {
					_this.scene.pause();
					count_time_end();
				}
				$('.game-time span').text(count_time + 's');

			},
			callbackScope: this,
			loop: true
		});

		gem_time_event = this.time.addEvent({
			delay: 600,
			callback: random_gem,
			callbackScope: this,
			loop: true
		});

		var enter_event = false;

		touch.on('#game', 'swipeleft', function() {
			if(enter_event){return};
			direction = --direction < 0 ? 0 : direction;
			person_x_change();
		});
		touch.on('#game', 'swiperight', function() {
			if(enter_event){return};
			direction = ++direction > 2 ? 2 : direction;
			person_x_change();
		});



		//random_things.call(this);
		person.anims.play('walk');

		this.physics.add.overlap(person, group_left, hit_col, null, this);
		this.physics.add.overlap(person, group_center, hit_col, null, this);
		this.physics.add.overlap(person, group_right, hit_col, null, this);


		this.scene.pause();

		var startY,startTime,isStart=false,endY;

		this.input.on('pointerdown', function(e) {
			isStart = true;
			startY = e.y;
			startTime = new Date().getTime();
		},this);
		this.input.on('pointermove', function(e) {
			endY = e.y;
		},this);
		this.input.on('pointerup', function(e) {
			if(enter_event){return};
			if(!isStart){return}
			endY = e.y;
			var touchTime  = new Date().getTime() - startTime;
			var distance = endY - startY;
			if (300 > touchTime && distance < -36) {
				person.y -=100;
				person.anims.play('jump');
				person.isJump = true;
				setTimeout(function(){
					person.y += 100;
					person.anims.play('walk');
					person.isJump = false;
					enter_event = false;
				},800);
			}
			isStart = false;
		},this);



		// this.scene.resume();
	}

	function update() {}

	function hit_col(person, gem) {
		if(person.isHit || person.isJump){
			gem.body.enable = false;
			return;
		}
		gem.setVisible(false);
		gem.body.enable = false;
		var index = gem.gem_index;
		if (gem.y > person.y+person.width/2) {
			if (index != 8 && index != 9 && index != 10) {
				hit_gem(index);
			} else if(index != 8) {
				hit_fail(person);
			}
		}
	}

	function hit_fail(person) {
		person.isHit = true;
		_t.tweens.add({
			targets: person,
			alpha: 0.2,
			ease: 'Power1',
			duration: 200,
			yoyo: true,
			repeat: 1,
			onStart: function() {},
			onComplete: function() {
				person.isHit = false;
			},
			onYoyo: function() {},
			onRepeat: function() {},
		});

	}

	function hit_gem(index) {
		$('.game-progress ul li').eq(index - 1).addClass('on');
		if ($('.game-progress ul li.on').length >= 7) {
			_t.scene.pause();
			$('.m-success').show();
		}
	}

	function count_time_end() {
		_t.scene.pause();
		if ($('.game-progress ul li.on').length >= 7) {
			$('.m-success').show();
		}else{
			$('.m-fail-num').text($('.game-progress ul li.on').length);
			$('.m-fail').show();
		}
	}

	function person_x_change() {
		var x = r_w / 2;
		if (direction == 0) {
			x -= 100;
		} else if (direction == 2) {
			x += 100;
		}
		person.x = x;
	}
	var gem_index = {
		left: 0,
		center: 0,
		right: 0,
	}

	function random_gem() {
		var left = group_left.getChildren()[gem_index.left];
		var center = group_center.getChildren()[gem_index.center];
		var right = group_right.getChildren()[gem_index.right];
		left.x = gem_left_start_x;
		left.y = gem_left_start_y;

		left.body.enable = true;
		center.body.enable = true;
		right.body.enable = true;
		center.x = gem_center_start_x;
		center.y = gem_center_start_y;
		right.x = gem_right_start_x;
		right.y = gem_right_start_y;
		left.setScale(1.5);
		right.setScale(1.5);
		center.setScale(1.5);

		var posi = Phaser.Math.Between(0, 2);
		// var posi = 1;
		if (posi == 0) {
			left.setVisible(true);
			this.tweens.add({
				targets: left,
				x: gem_left_end_x,
				y: gem_end_y,
				scaleX: 0.2,
				scaleY: 0.2,
				ease: 'Power1',
				duration: 3000,
				yoyo: false,
				repeat: 0,
				onStart: function() {},
				onComplete: function() {
					left.setVisible(false);
				},
				onYoyo: function() {},
				onRepeat: function() {},
			});
			++gem_index.left > group_left.getChildren().length - 1 ? gem_index.left = 0 : gem_index.left;
		} else if (posi == 1) {
			center.setVisible(true);
			this.tweens.add({
				targets: center,
				x: gem_center_end_x,
				y: gem_end_y,
				scaleX: 0.2,
				scaleY: 0.2,
				ease: 'Power1',
				duration: 3000,
				yoyo: false,
				repeat: 0,
				onStart: function() {},
				onComplete: function() {
					center.setVisible(false);
				},
				onYoyo: function() {},
				onRepeat: function() {},
			});
			++gem_index.center > group_center.getChildren().length - 1 ? gem_index.center = 0 : gem_index.center;

		} else {
			right.setVisible(true);
			this.tweens.add({
				targets: right,
				x: gem_right_end_x,
				y: gem_end_y,
				scaleX: 0.2,
				scaleY: 0.2,
				ease: 'Power1',
				duration: 3000,
				yoyo: false,
				repeat: 0,
				onStart: function() {},
				onComplete: function() {
					right.setVisible(false);
				},
				onYoyo: function() {},
				onRepeat: function() {},
			});
			++gem_index.right > group_right.getChildren().length - 1 ? gem_index.right = 0 : gem_index.right;

		}


	}
    /*
	function random_things() {
		var s1 = random_left_list.splice(0, 1)[0];
		s1.x = thing_left_start_x;
		s1.y = thing_left_start_y;
		s1.setScale(1);
		var s2 = random_right_list.splice(0, 1)[0];
		s2.x = thing_right_start_x;
		s2.y = thing_right_start_y;
		s2.setScale(1);
		s1.setVisible(true);
		s2.setVisible(true);
		this.tweens.add({
			targets: s1,
			x: thing_left_end_x,
			y: thing_left_end_y,
			scaleX: 0.3,
			scaleY: 0.3,
			ease: 'Power1',
			duration: 3000,
			yoyo: false,
			repeat: 0,
			onStart: function() {},
			onComplete: function() {
				s1.setVisible(false);
				random_left_list.push(s1);
			},
			onYoyo: function() {},
			onRepeat: function() {},
		});
		this.tweens.add({
			targets: s2,
			x: thing_right_end_x,
			y: thing_right_end_y,
			scaleX: 0.3,
			scaleY: 0.3,
			ease: 'Power1',
			duration: 3000,
			yoyo: false,
			repeat: 0,
			onStart: function() {},
			onComplete: function() {
				s2.setVisible(false);
				random_right_list.push(s2);
			},
			onYoyo: function() {},
			onRepeat: function() {},
		});
	}
    */
});
