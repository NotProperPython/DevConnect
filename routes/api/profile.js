const express = require("express");
const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const request = require("request");
const config = require("config");

const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    // Get currently logged-in user's profile
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "users",
      ["name", "avatar"]
    );

    // Check if profiles exists
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    // Return profile
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/
// @desc    Create or Update User Profile
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // Check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure the variables from the request
    const {
      company,
      website,
      location,
      bio,
      status,
      gitHubUsername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build Profile Object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (gitHubUsername) profileFields.gitHubUsername = gitHubUsername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    //Build Social Array
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      // If user exists then Update Profile
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      // Create Profile
      profile = new Profile(profileFields);

      // Save profile
      await profile.save();

      // Return JSON
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/profile
// @desc    Get All Profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    // Fetch all profiles + add user field with all User details to it as well
    const profiles = await Profile.find().populate("users", ["name", "avatar"]);
    // Return all profiles
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/user/userId
// @desc    Get Profiles By User ID
// @access  Public
router.get("/user/:userId", async (req, res) => {
  try {
    // Fetch profile by using the userId from URL
    const profile = await Profile.findOne({ user: req.params.userId }).populate(
      "users",
      ["name", "avatar"]
    );

    // Check if profile exists
    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }

    // Return profile
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }

    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/profile/
// @desc    Delete Profile + User & Posts
// @access  Private
router.delete("/", auth, async (req, res) => {
  try {
    // TODO - remove users posts

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/profile/experience
// @desc    Add Experience To Profile
// @access  Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // Check for Errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure variables from the request
    const { title, company, location, from, to, current, description } =
      req.body;

    // Create a experience object from those variables
    const experienceObj = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      // Fetch the currnently logged-in user's profile
      const profile = await Profile.findOne({ user: req.user.id });

      // Add this new experience at the start of their eperiences list
      profile.experiences.unshift(experienceObj);

      // Save the profile
      await profile.save();

      // Return the updated profile
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/profile/experience/:experienceId
// @desc    Delete Experience From Profile
// @access  Private
router.delete("/experience/:experienceId", auth, async (req, res) => {
  try {
    // Fetch the currnently logged-in user's profile
    const profile = await Profile.findOne({ user: req.user.id });

    // Find the experience in profile which matches URL param's experienceId
    const removeIndex = profile.experiences
      .map((item) => item.id)
      .indexOf(req.params.experienceId);

    // Remove the experience from the experiences object
    profile.experiences.splice(removeIndex, 1);

    // Save the profile
    await profile.save();

    // Return the updated profile
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//=============

// @route   PUT api/profile/education
// @desc    Add Education To Profile
// @access  Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldOfStudy", "Field of study is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // Check for Errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure variables from the request
    const { school, degree, fieldOfStudy, from, to, current, description } =
      req.body;

    // Create an education object from those variables
    const educationObj = {
      school,
      degree,
      fieldOfStudy,
      from,
      to,
      current,
      description,
    };

    try {
      // Fetch the currnently logged-in user's profile
      const profile = await Profile.findOne({ user: req.user.id });

      // Add this new education at the start of their education list
      profile.education.unshift(educationObj);

      // Save the profile
      await profile.save();

      // Return the updated profile
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/profile/education/:educationId
// @desc    Delete Education From Profile
// @access  Private
router.delete("/education/:educationId", auth, async (req, res) => {
  try {
    // Fetch the currnently logged-in user's profile
    const profile = await Profile.findOne({ user: req.user.id });

    // Find the education in profile which matches URL param's educationId
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.educationId);

    // Remove the education from the experiences object
    profile.education.splice(removeIndex, 1);

    // Save the profile
    await profile.save();

    // Return the updated profile
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  public
router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "gitHubClientId"
      )}&client_secret=${config.get("gitHubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    request(options, (error, resonse, body) => {
      if (error) console.error(error);
      if (resonse.statusCode !== 200) {
        return res.status(404).json({ msg: "No Github profile found" });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
